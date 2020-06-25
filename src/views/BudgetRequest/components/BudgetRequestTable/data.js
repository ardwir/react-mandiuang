import uuid from 'uuid/v1';

export default [
  {
    id: uuid(),
    ref: '1',
    amount: 'Rp. 10.000.000',
    branch: {
      ids: '100',
      name: 'ABC Part 1'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: '2',
    amount: 'Rp. 12.500.000',
    branch: {
      ids: '101',
      name: 'ABC Part 2'
    },
    createdAt: 1555016400000,
    status: 'done'
  },
  {
    id: uuid(),
    ref: '3',
    amount: 'Rp. 20.000.000',
    branch: {
      ids: '103',
      name: 'ABC Part 4'
    },
    createdAt: 1554930000000,
    status: 'rejected'
  },
  {
    id: uuid(),
    ref: '4',
    amount: 'Rp. 15.000.000',
    branch: {
      ids: '102',
      name: 'ABC Part 3'
    },
    createdAt: 1554757200000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: '5',
    amount: 'Rp. 10.000.000',
    branch: {
      ids: '100',
      name: 'ABC Part 1'
    },
    createdAt: 1554670800000,
    status: 'done'
  },
  {
    id: uuid(),
    ref: '6',
    amount: 'Rp. 5.000.000',
    branch: {
      ids: '100',
      name: 'ABC Part 1'
    },
    createdAt: 1554670800000,
    status: 'done'
  }
];
