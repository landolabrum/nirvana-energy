// Relative Path: ./lights.tsx
import React, { useEffect, useState } from 'react';
import styles from './Lights.scss';
import { getService } from '@webstack/common';
import IHomeService from '~/src/core/services/HomeService/IHomeService';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiBar from '@webstack/components/Graphs/UiBar/UiBar';
import ToggleSwitch from '@webstack/components/UiToggle/UiToggle';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import UiInput from '@webstack/components/UiInput/UiInput';
import UiMediaSlider from '@webstack/components/UiMedia/views/UiMediaSlider/UiMediaSlider';
import UiButton from '@webstack/components/UiButton/UiButton';
import { calculateHexFromHueSatBri } from './LightHelpers';
import { reverseString } from '@webstack/helpers/Strings/reverseString';
import ColorPicker from '@webstack/components/ColorPicker/ColorPicker';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

// Remember to create a sibling SCSS file with the same name as this component
type ILight = {
  id_: string;
  name: string;
  is_on: boolean;
  view?: string;
  bri: number;
  hue: number;
  sat: number;
  hex: string;
}
const Lights = () => {
  const [loader, setLoader] = useLoader();
  const [newName, setNewName] = useState<any | undefined>();
  const [go, setGo] = useState<any | undefined>(false);
  const [currentLight, setCurrentLight] = useState<ILight | undefined>();
  const [lights, setLights] = useState<any>();
  const [isAll, setIsAll] = useState<boolean | ILight>(false);
  const homeService = getService<IHomeService>('IHomeService');

  const updateLight = (changedLight: ILight, isColor?: boolean) => {
    setLights(() => lights.map((light: ILight) => {
      if (light.id_ == changedLight.id_) {
        if (isColor) changedLight.view = 'color'
        light = changedLight;
      }
      return light;
    }))
  };

  const toggleBarView = (id: string) => {
    const updateLightsWithView = lights.map((light: ILight) => {
      if (light?.id_ == id) {
        if (light?.view == undefined) {
          light.view = 'color'
        } else if (light?.view != undefined) delete light.view

      }
      return light
    });
    setLights(updateLightsWithView)
  }


  const handleNewName = (e: any) => {
    let { name, value } = e;
    if (e.target) {
      name = e.target.name;
      value = e.target.value;
    }
    if (name && value) setNewName(e);
  }

  const onLights = lights?.filter((light: ILight) => light.is_on) || [];
  const handleLightAnimation = (color: string) => {
    if (onLights.length === 0) return;
    const currentLightIndex = currentLight ? onLights.findIndex((light: ILight) => light.id_ === currentLight.id_) : -1;
    const nextLightIndex = (currentLightIndex + 1) % onLights.length;
    const nextLight = onLights[nextLightIndex];
    setCurrentLight(nextLight);
    multiHomeService('color', { id: nextLight.id_, hex: color });
  };


  const initfetchLights = () => {
    if (lights !== undefined) return;
    fetchLights().then(() => setLoader({ active: false }));
  }
  const atPoints = onLights && onLights.map((light: ILight, index: number) => {
    const newHex = light?.hex ? `#${reverseString(light.hex.substring(1, light.hex.length))}` : '#ff3300'
    return {
      time: (index + 1) * 1000,
      value: newHex,
      backgroundColor: newHex,
      onPoint: handleLightAnimation
    };
  });
  const fetchLights = async () => {
    setLoader({ active: true, body: 'loading lights', animation: true });
    try {
      let response = await homeService.lights();
      setLights(response);

    } catch (e: any) {
      console.log('[ FETCH LIGHTS (ERR) ]', JSON.stringify(e))
    }
  }

  const multiHomeService = async (action: string, data?: any) => {
    const handleLoader =  (active: boolean, action?: string, name?: string) => {
      setLoader({ active: active, body: `${action}, ${name} `, animation: true });
    }
    handleLoader(true, action, data.name);
    const runAction = async () => {
      try {
        let response;
        switch (action) {
          case 'all-off':
            response = await homeService.lightsOff();
            break;
          case 'all-on':
            response = await homeService.lightsOn();
            console.log('all-on', response)
            break;
          case 'toggle':
            if (data?.id) {
              response = await homeService.lightToggle(data.id);
              updateLight(response);
            }
            break;
          case 'brightness':
            if (data?.id && data?.bri !== undefined) {
              response = await homeService.lightBrightness(data.id, data.bri);
              updateLight(response);
            }
            break;
          case 'color':
            if (data?.id && data?.hex) {
              const colorResponse = await homeService.lightColor(data.id, data.hex);
              const calculatedHex = calculateHexFromHueSatBri(colorResponse.hue, colorResponse.sat, colorResponse.bri);
              updateLight({ ...colorResponse, hex: calculatedHex, isColor: true }, true);
            }
            break;
          case 'all-color':
            if (data?.hex) {
              const promises = lights.map((light: ILight) => {
                if (light.is_on) {  // Assuming you only want to change the color of lights that are on
                  return homeService.lightColor(light.id_, data.hex);
                }
              });
              const responses = await Promise.all(promises);
              responses.forEach(resp => {
                const calculatedHex = calculateHexFromHueSatBri(resp.hue, resp.sat, resp.bri);
                updateLight({ ...resp, hex: calculatedHex, isColor: true }, true);
              });
            }
            break;
          default:
            console.log('[multiHomeService] Action not recognized:', action);
            return;
        }
        if (response) {
          console.log('[multiHomeService] Success:', JSON.stringify(response));
        }
      } catch (e: any) {
        console.log('[multiHomeService] Error:', JSON.stringify(e));
      }
      return;
    }
    await runAction();
    handleLoader(false, action, data.name);
  }

  useEffect(() => { }, [multiHomeService])
  useEffect(() => {
    initfetchLights();
  }, [currentLight]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='lights'>
        <AdaptGrid xs={2} lg={3} gap={15}>
          <UiButton variant={go && 'primary'} onClick={() => setGo(!go)}>start animation</UiButton>
          <UiButton variant={go && 'primary'} onClick={() => isAll == false ? setIsAll({ ...onLights[0], id_: 'all-lights' }) : false}>
            Set All
          </UiButton>
        </AdaptGrid>
        <UiMediaSlider
          backgroundColors={['#ff3300', '#00ff00', '#ff0000']}
          atPoints={atPoints}
          duration={10000}
          start={go}
        />

        {lights && !isAll && <AdaptGrid xs={1} sm={2} md={2} lg={3} gap={15}>
          {Object.entries(lights).map(
            ([key, light]: any, index: number) =>
              <div className='lights__light' key={index}>

                <div className='lights__light-header'>
                  <div className='lights__light-header--action'>
                    <UiInput size='sm' value={light.name} disabled={true} label='name' />
                  </div>

                  <div className='lights__light-header--action' onClick={() => multiHomeService('toggle', { id: light.id_ })}>
                    <ToggleSwitch name={light?.id_} value={light?.is_on} />
                  </div>
                  <div
                    className='lights__light-header--action'
                    onClick={() => toggleBarView(light.id_)}
                  >
                    <UiIcon icon='fa-palette' />
                  </div>
                </div>

                {light?.view !== 'color' ? (
                  <UiBar
                    onChange={(value) => {
                      if (String(value).length == 0 || !value) return;
                      else multiHomeService('brightness', { id: light.id_, bri: value, name: light.name });
                    }}
                    barCount={5}
                    percentage={light?.bri * 100 / 254}
                  />
                ) : (
                  <ColorPicker
                    hex={light.hex}
                    onChange={(hex: string) => multiHomeService('color', { id: light.id_, hex: hex, name: light.name })}
                  />
                )}
              </div>
          )}
        </AdaptGrid>}
        {typeof isAll == 'object' && (
          <UiBar
            onChange={(value) => {
              if (String(value).length == 0 || !value) return;
              else if (String(value).startsWith('#')) multiHomeService('color', { id: isAll.id_, hex: value });
              else multiHomeService('brightness', { id: isAll.id_, bri: value });
            }}
            barCount={5}
            percentage={isAll?.bri * 100 / 254}
          />
        )}
      </div>
    </>
  );
};

export default Lights;
