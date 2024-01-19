import {View, Text} from 'react-native';
import React, {forwardRef, useMemo} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';

const CustomBottomSheet = forwardRef((props, ref) => {
  const snapShot = useMemo(() => ['40%', '50%', '70%'], []);
  // <CustomBottomSheet title={'Awesome Data'} ref={bottmoSheetRef} /> /call that

  return (
    <BottomSheet
      ref={ref}
      index={1}
      snapPoints={snapShot}
      enablePanDownToClose={true}
      backgroundStyle={{backgroundColor: '#408798'}}
      handleIndicatorStyle={{backgroundColor: 'white'}}>
      <View>
        <Text>{props.title}</Text>
      </View>
    </BottomSheet>
  );
});

export default CustomBottomSheet;
