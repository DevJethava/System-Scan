@file:Suppress("DEPRECATION")

package com.system_scan_kt

import android.annotation.SuppressLint
import android.content.Context
import android.content.res.Resources
import android.net.NetworkInfo
import android.net.wifi.WifiManager
import android.os.AsyncTask
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.gson.Gson
import com.system_scan_kt.portauthority.Host
import com.system_scan_kt.portauthority.MainAsyncResponse
import com.system_scan_kt.portauthority.ScanHostsAsyncTask
import com.system_scan_kt.portauthority.Wireless
import com.system_scan_kt.portauthority.Wireless.NoConnectivityManagerException
import com.system_scan_kt.portauthority.Wireless.NoWifiManagerException
import org.json.JSONObject
import java.net.SocketException
import java.net.UnknownHostException
import java.util.Collections
import java.util.concurrent.atomic.AtomicInteger


class NetworkDiscoveryModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val TIMER_INTERVAL = 1500
    private val DEFAULT_HOST_SOCKET_TIMEOUT = "500"
    private val VIBRATE = 250L
    private var scanHandler: Handler? = null
    private var mHosts = Collections.synchronizedList(ArrayList<Host>())
    override fun getName() = "NetworkDiscoveryModule"

    @SuppressLint("LongLogTag")
    @ReactMethod
    fun getNetworkDiscovery2() {
        Log.e(
            "getNetworkDiscovery2 => ",
            "Called"
        )
        mHosts.clear()
        scanHandler = Handler(Looper.getMainLooper())
        val wifi = Wireless(currentActivity)
        val info: NetworkInfo? =
            currentActivity?.intent?.getParcelableExtra(WifiManager.EXTRA_NETWORK_INFO)


        if (info != null) {
            getNetworkInfo(info, wifi)
        }

        val resources: Resources? = currentActivity?.resources
        try {
            if (!wifi.isEnabled) {
                Log.e(
                    "getNetworkDiscovery2 => ",
                    resources?.getString(R.string.wifiDisabled).toString()
                )
//                return
            }
            if (!wifi.isConnectedWifi) {
                Log.e(
                    "getNetworkDiscovery2 => ",
                    resources?.getString(R.string.notConnectedWifi).toString()
                )
//                return
            }
        } catch (e: NoWifiManagerException) {
            Log.e(
                "getNetworkDiscovery2 => ",
                resources?.getString(R.string.failedWifiManager).toString()
            )
//            return
        } catch (e: NoConnectivityManagerException) {
            Log.e(
                "getNetworkDiscovery2 => ",
                resources?.getString(R.string.failedWifiManager).toString()
            )
//            return
        }

        val numSubnetHosts: Int = try {
            wifi.numberOfHostsInWifiSubnet
        } catch (e: NoWifiManagerException) {
            Log.e(
                "getNetworkDiscovery2 => ",
                resources?.getString(R.string.failedSubnetHosts).toString()
            )
//            return
        }

        Log.e("numSubnetHosts", numSubnetHosts.toString())

        try {
            var progressInt = 0
            val ip = wifi.getInternalWifiIpAddress(wifi.type)
            ScanHostsAsyncTask(currentActivity?.applicationContext, object : MainAsyncResponse {

                /**
                 * Delegate to update the host list and dismiss the progress dialog
                 * Gets called when host discovery has finished
                 *
                 * @param hostEntry The host to add to the list of discovered hosts
                 * @param numberOfHosts Number of hosts
                 */
                override fun processFinish(hostEntry: Host?, numberOfHosts: AtomicInteger?) {
                    scanHandler?.post {
                        if (hostEntry != null) {
                            mHosts.add(hostEntry)
                            reactContext
                                .getJSModule(
                                    DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                                )
                                .emit("onNetworkHostUpdate", Gson().toJson(hostEntry))
                            Log.e("Hosts => ", Gson().toJson(mHosts))
                        }
                        Log.e("Host Count => ", " (" + mHosts.size + ")")
                    }
                }

                /**
                 * Delegate to update the progress of the host discovery scan
                 *
                 * @param progress The amount of progress to increment by
                 */
                override fun processFinish(progress: Int) {
                    progressInt += progress
                    //
                    Log.e("Progress => ", progressInt.toString())
                    val jsonObject = JSONObject()
                    jsonObject.put("progressCount", progressInt)
//                    jsonObject.put("progressTill", numSubnetHosts)
                    jsonObject.put("isFinished", false)
                    reactContext
                        .getJSModule(
                            DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                        )
                        .emit("onNetworkProgress", jsonObject.toString())
                }

                /**
                 * Delegate to handle setting the external IP in the UI
                 *
                 * @param externalIp External IP
                 */
                override fun processFinish(externalIp: String?) {
                    Log.e("externalIp => ", externalIp.toString())
                }

                /**
                 * Delegate to dismiss the progress dialog
                 *
                 * @param isFinished
                 */
                override fun processFinish(isFinished: Boolean) {
                    if (isFinished) {
                        Log.e("Hosts => ", Gson().toJson(mHosts))
                        val jsonObject = JSONObject()
                        jsonObject.put("progressCount", -1)
//                    jsonObject.put("progressTill", numSubnetHosts)
                        jsonObject.put("isFinished", true)
                        reactContext
                            .getJSModule(
                                DeviceEventManagerModule.RCTDeviceEventEmitter::class.java
                            )
                            .emit("onNetworkProgress", jsonObject.toString())

                        val vibrator =
                            currentActivity?.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                            vibrator.vibrate(
                                VibrationEffect.createOneShot(
                                    VIBRATE,
                                    VibrationEffect.DEFAULT_AMPLITUDE
                                )
                            )
                        } else {
                            vibrator.vibrate(200)
                        }
                    }
                }

                /**
                 * Delegate to handle bubbled up errors
                 *
                 * @param output The exception we want to handle
                 * @param <T>    Exception
                 */
                override fun <T : Throwable?> processFinish(output: T) {
                    Log.e("Exception => ", output?.localizedMessage.toString())
                }

            }).executeOnExecutor(
                AsyncTask.THREAD_POOL_EXECUTOR,
                ip,
                wifi.internalWifiSubnet,
                DEFAULT_HOST_SOCKET_TIMEOUT.toInt()
            )
        } catch (e: UnknownHostException) {
            Log.e(
                "getNetworkDiscovery2 => ",
                resources?.getString(R.string.notConnectedWifi).toString()
            )
        } catch (e: NoWifiManagerException) {
            Log.e(
                "getNetworkDiscovery2 => ",
                resources?.getString(R.string.notConnectedWifi).toString()
            )
        }
    }

    /**
     * Gets network information about the device and updates various UI elements
     */
    private fun getNetworkInfo(info: NetworkInfo, wifi: Wireless) {
        setupMac(wifi)

        val resources: Resources? = currentActivity?.resources
        try {
            val enabled: Boolean = wifi.isEnabled
            if (!info.isConnected || !enabled) {
                Log.e("getNetworkInfo => ", Wireless.getInternalMobileIpAddress())
            }
            if (!enabled) {
                Log.e("getNetworkInfo => ", resources?.getString(R.string.wifiDisabled).toString())
//                return
            }
        } catch (e: NoWifiManagerException) {
            Log.e("getNetworkInfo => ", resources?.getString(R.string.failedWifiManager).toString())
        }
        if (!info.isConnected) {
            Log.e("getNetworkInfo => ", resources?.getString(R.string.noWifiConnection).toString())
//            return
        }
        val signalHandler = Handler()
        signalHandler.postDelayed(object : Runnable {
            override fun run() {
                val speed: Int = try {
                    wifi.linkSpeed
                } catch (e: NoWifiManagerException) {
                    Log.e(
                        "getNetworkInfo => ",
                        resources?.getString(R.string.failedLinkSpeed).toString()
                    )
//                    return
                }
                val signal: Int = try {
                    wifi.signalStrength
                } catch (e: NoWifiManagerException) {
                    Log.e(
                        "getNetworkInfo => ",
                        resources?.getString(R.string.failedSignal).toString()
                    )
//                    return
                }

                Log.e(
                    "getNetworkInfo => ", String.format(
                        resources?.getString(R.string.signalLink).toString(),
                        signal,
                        speed
                    )
                )
                signalHandler.postDelayed(this, TIMER_INTERVAL.toLong())
            }
        }, 0)
        val wifiSsid: String = try {
            wifi.ssid
        } catch (e: NoWifiManagerException) {
            Log.e(
                "getNetworkInfo => ",
                resources?.getString(R.string.failedSsid).toString()
            )
            "return"
        }
        val wifiBssid: String = try {
            wifi.bssid
        } catch (e: NoWifiManagerException) {
            Log.e(
                "getNetworkInfo => ",
                resources?.getString(R.string.failedBssid).toString()
            )
            "return"
        }

        Log.e("ssid", wifiSsid)
        Log.e("bssid", wifiBssid)
    }

    /**
     * Sets up the device's MAC address and vendor
     */
    private fun setupMac(wifi: Wireless) {
        var macAddress = ""
        try {
            if (!wifi.isEnabled) {
                macAddress = currentActivity?.getString(R.string.wifiDisabled).toString()
                return
            }
            val mac: String = wifi.macAddress
            macAddress = mac
        } catch (e: UnknownHostException) {
            macAddress = currentActivity?.getString(R.string.noWifiConnection).toString()
        } catch (e: SocketException) {
            macAddress = currentActivity?.getString(R.string.noWifiConnection).toString()
        } catch (e: NoWifiManagerException) {
            macAddress = currentActivity?.getString(R.string.noWifiConnection).toString()
        } catch (e: Wireless.NoWifiInterface) {
            macAddress = currentActivity?.getString(R.string.noWifiInterface).toString()
        } finally {
            Log.e("setupMac => ", macAddress)
        }
    }
}