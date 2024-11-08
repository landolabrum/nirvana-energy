import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import styles from "./SurveillanceItem.scss";
import UiMedia from "@webstack/components/UiMedia/controller/UiMedia";
import environment from "~/src/core/environment";
import { dateFormat } from "@webstack/helpers/userExperienceFormats";
import { useCallback, useEffect, useState } from "react";

interface ISurveillanceItem{
    camera: any, onSelect?:(e:any)=>void
}
const SurveillanceItem = ({camera,onSelect}:ISurveillanceItem) => {
    const [status,setStatus]=useState<any>();
    const handleStatus = 
        (e:any) =>{
            // console.log("[ handleStatus ]",e)
            if(e.available && status?.available )return;
            setStatus(e)
        }
        
        useEffect(()=>{}, [handleStatus]);
    return <>
        <style jsx>{styles}</style>
        <div className='surveillance-item' onClick={()=>onSelect?.(camera.nickname)}>
            {/* {status && JSON.stringify(status)||'no staus'} */}
            <div className='surveillance-item__header'>
                <div className='surveillance-item__header--title'>{camera?.nickname}</div>
           
            <div className='surveillance-item__header--status'>
            <div className='surveillance-item__time'>
                        {dateFormat(camera?.img_time, { isTimestamp: true })}
                    </div>
                <div>
                    <UiIcon icon={camera?.audio ? 'fa-volume' : 'fa-volume-xmark'} />
                </div>
                <div>
                    <UiIcon color={status?.available?'var(--green-70)':'var(--red-70)'} icon={status?.available ? 'fa-signal' : 'fa-signal-slash'} />
                    {status?.available?.toString()} 
                </div>
                </div>
            </div>
            <div className='surveillance-item__snapshot' >
                {camera?.snapshot_url && <UiMedia
                    onLoad={handleStatus}
                    alt={camera.nickname}
                    loadingText={camera.nickname}
                    src={`${environment.serviceEndpoints.membership}/api/stream/img?id=${String(camera.nickname).toLowerCase()}`}
                />}
            </div>
        </div>
    </>
}
export default SurveillanceItem;