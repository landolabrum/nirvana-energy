// Relative Path: ./AccountMethod.tsx
import React, { useEffect, useState } from 'react';
import styles from './UserMethods.scss';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import { getService } from '@webstack/common';
import { IMethod } from '../../../model/IMethod';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import UserCurrentMethods from '../views/UserCurrentMethods/UserCurrentMethods';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { useLoader } from '@webstack/components/Loader/Loader';
import UserCreateMethod from '../views/UserCreateMethod/controller/UserCreateMethod';
import UserContext from '~/src/models/UserContext';



interface IUserMethods {
  open?: boolean | 'opened';
  customerMethods?: any;
  user?: UserContext;
  selected?: string;
  onSelect?: (method?: IMethod) => void;
  onSuccess?: (e: any) => void;
}
const UserMethods: React.FC<any> = ({ user, open, customerMethods, selected, onSelect, onSuccess }: IUserMethods) => {
  const [loader, setLoader] = useLoader();
  const [label, setLabel] = useState<any>('payment methods');
  const [methods, setMethods] = useState<IMethod[]>([]);
  const [selectedUser, setUser] = useState<UserContext | undefined>();

  const MemberService = getService<IMemberService>("IMemberService");

  const handleDelete = async (id: string) => {
    getAccountMethods();
  }
  const handleCreated = (e: any) => {
    getAccountMethods();
    onSuccess && onSuccess(e)
  }

  const getAccountMethods = async (e?: any) => {
    if (!selectedUser) return;
    const methodsResponse = await MemberService.getMethods(selectedUser.id);
      if(methodsResponse?.data?.length === 1 && onSelect)onSelect(methodsResponse?.data[0])
      setMethods(methodsResponse?.data);
  }
  const handleLabel = () => {
    if (selectedUser && methods.length && !open) {
      let default_method: any = methods.find(m => m.id == selectedUser?.invoice_settings?.default_payment_method);
      if (default_method?.card) {
        default_method = <div style={{ display: 'flex', alignItems: "center", gap: '16px' }}>
          <UiIcon icon={default_method.card.brand} /> {`**** **** **** ${default_method.card.last4}`}
        </div>
        setLabel(default_method);
      }
    }
  }
  const signed_in_user = useUser();
  const canSelect = selected !== undefined && onSelect;
  const handleMethodUser = () =>{
    if (!user) setUser(signed_in_user);
    else if (user) setUser(user);
  }
  const handleMethod =()=>!customerMethods && getAccountMethods() || setMethods(customerMethods);
  const initUserMethods = () =>{
    setLoader({ active: true });
    handleMethodUser();
    handleLabel();
    handleMethod();
    setLoader({ active: false });
  }
  const userHasCards = Boolean(Object.entries(methods).filter(([_, m]:any)=>m?.card)?.length);
  useEffect(() => {
  initUserMethods();
  }, [setUser, selectedUser, open]);
  if (selectedUser) return (
    <>
      <style jsx>{styles}</style>

      <div className='user-methods'>
        {userHasCards &&
          <div
            className={`user-methods__existing ${canSelect ? ' user-methods__existing__selected' : ''}`}
          // className='user-methods__existing'
          >
            {onSelect && <div className={`${!selected ? 'existing__select' : 'existing__selected'}`}>
              {selected ?
                <UserCurrentMethods
                  user={selectedUser}
                  methods={[selected]}
                  onDeleteSuccess={handleDelete}
                  response={loader.active}
                  selected={selected}
                  onSelect={onSelect}
                /> : 'Select a payment method'}
            </div>
            }
            {!selected &&
              <div className='user-methods__list'>
                <div className='user-methods__existing--title'>
                  current methods
                </div>
                <UserCurrentMethods
                  user={selectedUser}
                  methods={methods}
                  onDeleteSuccess={handleDelete}
                  response={loader.active}
                  selected={selected}
                  onSelect={onSelect}
                />
              </div>
            }
            {/* {selected && <UserSelectMethod user={selectedUser} methods={methods}/>} */}
          </div>
        }
          <UserCreateMethod user={selectedUser} onSuccess={handleCreated} />
      </div>
    </>
  );
  return <>..load user</>
};

export default UserMethods;