package com.system_scan_kt.portauthority;

interface ErrorAsyncResponse {

    /**
     * Delegate to bubble up errors
     *
     * @param output
     */
    <T extends Throwable> void processFinish(T output);
}
