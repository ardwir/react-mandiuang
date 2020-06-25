import uuid from 'uuid/v1';

export default [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Branch A'
    },
    createdAt: 1555016400000,
    status: 'Pending'
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Branch B'
    },
    createdAt: 1555016400000,
    status: 'Accept'
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Branch F'
    },
    createdAt: 1554930000000,
    status: 'Reject'
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Branch E'
    },
    createdAt: 1554757200000,
    status: 'Pending'
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Branch C'
    },
    createdAt: 1554670800000,
    status: 'Accept'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Branch A'
    },
    createdAt: 1554670800000,
    status: 'Accept'
  }
];
