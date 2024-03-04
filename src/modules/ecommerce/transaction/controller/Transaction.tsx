// Relative Path: ./Transaction.tsx
import React, { useEffect, useState } from 'react';
import styles from './Transaction.scss';
import { getService } from '@webstack/common';
import IMemberService from '~/src/core/services/MemberService/IMemberService';
import CookieHelper from '@webstack/helpers/CookieHelper';
import UiButton from '@webstack/components/UiButton/UiButton';
import UiDev from '@webstack/components/UiDev/UiDev';
import { dateFormat, numberToUsd } from '@webstack/helpers/userExperienceFormats';
import UserContext from '~/src/models/UserContext';
import { useUser } from '~/src/core/authentication/hooks/useUser';
import { useProspect } from '~/src/core/authentication/hooks/useProspect';

// Remember to create a sibling SCSS file with the same name as this component

const Transaction: React.FC = () => {
  const user = useUser();

  const MemberService = getService<IMemberService>('IMemberService');
  const [selectedUser, setUser] = useState<UserContext | { email: string } | undefined>();
  const [transaction, setTransaction] = useState<any>();
  const prospect = useProspect();

  const loadTransaction = () => {
    if (transaction) return;
    const hasTransaction = CookieHelper.getCookie('transaction-token');
    const decryptToken = async (token: string) => {
      if (token) {
        try {
          const response = await MemberService.decryptJWT({
            token: token,
            secret: 'secretKey',
            algorithm: 'HS256'
          });
          if (response?.decoded) {
            console.log('[ JWT DECODE (SUCCESS) ]', response.decoded);
            setTransaction(response.decoded);
          }
        } catch (error: any) {
          setTransaction({ error: error?.detail?.detail });
          console.error('[ JWT DECODE (ERROR) ]', error?.detail?.detail);
        }
      }
    };
    if (hasTransaction) {
      CookieHelper.deleteCookie('cart');
      decryptToken(hasTransaction);
    }
  }
  const handleUser = () => {
    if (selectedUser) return;
    if (user || prospect) setUser(user || prospect);
  };
  useEffect(() => {
    handleUser();
  }, [handleUser, user]);
  useEffect(() => {
    loadTransaction();
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      {/* <UiDev data={transaction} /> */}

      <div className='transaction'>
        {transaction?.total !== undefined && <div className='transaction__header'>
          <div className='transaction__title'>
            <div className='transaction__title--status'>Purchase Success</div>
          </div>
        </div>}
        <div className='transaction__content card'>
          <div className='transaction__content-title'>
          {transaction?.data?.id && <div className='transaction--pi'><div>PURCHASE ID</div><div>{transaction.data.id}</div></div>}
          {transaction?.data?.created && <div className='transaction--date'><div>Purchased</div><div>{dateFormat(transaction.data.created, { isTimestamp: true })}</div></div>}
          {selectedUser && <div className='transaction--email'><div>Email</div><div>{selectedUser?.email}</div></div>}
          </div>
          {transaction?.cart_items && <>
            <div className='transaction--list'>
              {Array(transaction?.cart_items).map(
                ([field, value]: any) => {
                  return <div className='transaction__item' key={field.name}>
                    <div className='transaction__item-name'>
                      {field.name}
                    </div>
                    <div className='transaction__item-description'>
                      {field.description}
                    </div>
                    <div className='transaction__item-amount'>
                      {numberToUsd(field.price?.unit_amount)}
                    </div>
                  </div>
                })}
            <div className='transaction--total'><div>total</div> <div>{numberToUsd(transaction.total)}</div></div>
            </div>
          </>
          }
          {transaction?.error?.includes("Your card was declined.") && <div className='card transaction__error declined'>
            <div className='transaction__title'>
              Your card was declined
            </div>
            <UiButton href="/cart">return to cart</UiButton>
          </div>}
        </div>
      </div>
      {/* {JSON.stringify(transaction)} */}
    </>
  );
};

export default Transaction;