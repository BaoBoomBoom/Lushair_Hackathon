/** @format */

import React from 'react';
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from '@worldcoin/idkit';
import { Button } from 'antd';
function WorldID() {
  const onSuccess = (result: ISuccessResult) => {
    console.log(result);
  };
    const verufyProof = async (proof: string) => {
        // Send the proof to your server to verify the proof
    }

  return (
    <IDKitWidget
      app_id="app_staging_d81bad526458fcdc7a16f82c874f7d8b"
      action="chance"
      // On-chain only accepts Orb verifications
      verification_level= {VerificationLevel.Device} 
  
      handleVerify={verifyProof}
      onSuccess={onSuccess}>
      {({ open }) => (
        <Button
          className="bg-[#3770ff] hover:bg-[#2368fb] rounded-[10px] mr-[10px] ml-2 px-[30px] font-bold text-[16px]"
          onClick={open}>
          Verify with World ID
        </Button>
      )}
    </IDKitWidget>
  );
}

export default WorldID;
