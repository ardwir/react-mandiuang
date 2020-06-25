import uuid from 'uuid/v1';

export default [
  {
    id: uuid(),
    transferID: '1',
    amount: 'Rp. 10.000.000',
    branch: {
      ids: '100',
      name: 'ABC Part 1'
    },
    destination:{
        id: '001',
        name: 'Toko 1'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },
  {
    id: uuid(),
    transferID: '2',
    amount: 'Rp. 12.500.000',
    branch: {
      ids: '101',
      name: 'ABC Part 2'
    },
    destination:{
        id: '002',
        name: 'Toko 2'
    },
    createdAt: 1555016400000,
    status: 'done'
  },
  {
    id: uuid(),
    transferID: '3',
    amount: 'Rp. 20.000.000',
    branch: {
      ids: '103',
      name: 'ABC Part 4'
    },
    destination:{
        id: '001',
        name: 'Toko 1'
    },
    createdAt: 1554930000000,
    status: 'rejected'
  },
  {
    id: uuid(),
    transferID: '4',
    amount: 'Rp. 15.000.000',
    branch: {
      ids: '102',
      name: 'ABC Part 3'
    },
    destination:{
        id: '002',
        name: 'Toko 2'
    },
    createdAt: 1554757200000,
    status: 'pending'
  },
  {
    id: uuid(),
    transferID: '5',
    amount: 'Rp. 10.000.000',
    branch: {
      ids: '100',
      name: 'ABC Part 1'
    },
    destination:{
        id: '001',
        name: 'Toko 1'
    },
    createdAt: 1554670800000,
    status: 'done'
  },
  {
    id: uuid(),
    transferID: '6',
    amount: 'Rp. 5.000.000',
    branch: {
      ids: '100',
      name: 'ABC Part 1'
    },
    destination:{
        id: '002',
        name: 'Toko 2'
    },
    createdAt: 1554670800000,
    status: 'done'
  }
];
