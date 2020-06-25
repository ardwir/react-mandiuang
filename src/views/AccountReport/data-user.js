import uuid from 'uuid/v1';

export default [
  {
    id: uuid(),
    trxId: '1',
    username: 'TEST123456',
    email: 'test.123456@abc.com',
    phone: '304-428-3097',
    accDestination: '5271427486',
    trxAmount: 'Rp. 15.000.000',
    trxType: 'DB',
    avatarUrl: '/images/avatars/avatar_3.png',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    trxId: '2',
    username: 'TEST123457',
    email: 'test.123457@abc.com',
    avatarUrl: '/images/avatars/avatar_4.png',
    phone: '712-351-5711',
    accDestination: '5271427487',
    trxAmount: 'Rp. 5.000.000',
    trxType: 'DB',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    trxId: '3',
    username: 'TEST123458',
    email: 'test.123458@abc.com',
    phone: '770-635-2682',
    accDestination: '5271427488',
    trxAmount: 'Rp. 10.000.000',
    trxType: 'DB',
    avatarUrl: '/images/avatars/avatar_2.png',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    trxId: '4',
    username: '5271427485',
    email: 'test.123458@abc.com',
    phone: '770-635-2682',
    accDestination: '1234567890',
    trxAmount: 'Rp. 120.000.000',
    trxType: 'KR',
    avatarUrl: '/images/avatars/avatar_7.png',
    createdAt: 1555016400000
  }
];
