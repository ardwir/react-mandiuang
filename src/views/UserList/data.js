import uuid from 'uuid/v1';

export default [
  {
    id: uuid(),
    branchId: '100',
    branchName: 'ABC Part 1',
    branchAccountNumber: '1234567890',
    balance: 'Rp. 210.000.000',
    address: {
      country: 'Indonesia',
      state: 'DKI Jakarta',
      city: 'Jakarta Barat',
      street: 'M.H. Thamrin'
    },
    avatarUrl: '/images/avatars/avatar_3.png',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    branchId: '101',
    branchName: 'ABC Part 2',
    branchAccountNumber: '1234567891',
    balance: 'Rp. 125.000.000',
    address: {
      country: 'Indonesia',
      state: 'DKI Jakarta',
      city: 'Jakarta Timur',
      street: 'M.H. Thamrin'
    },
    avatarUrl: '/images/avatars/avatar_4.png',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    branchId: '102',
    branchName: 'ABC Part 3',
    branchAccountNumber: '1234567892',
    balance: 'Rp. 100.000.000',
    address: {
      country: 'Indonesia',
      state: 'DKI Jakarta',
      city: 'Jakarta Pusat',
      street: 'M.H. Thamrin'
    },
    avatarUrl: '/images/avatars/avatar_2.png',
    createdAt: 1555016400000
  },
  {
    id: uuid(),
    branchId: '103',
    branchName: 'ABC Part 4',
    branchAccountNumber: '1234567893',
    balance: 'Rp. 50.000.000',
    address: {
      country: 'Indonesia',
      state: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      street: 'M.H. Thamrin'
    },
    avatarUrl: '/images/avatars/avatar_5.png',
    createdAt: 1554930000000
  }
];
