import uuid from 'uuid/v1';

export default [
  {
    id: uuid(),
    from: 'A',
    to: 'B',
    amount: 'Rp 50.000.000',
    createAt: 1555016400000,
    status: 'Done'
  },
  {
    id: uuid(),
    from: 'C',
    to: 'D',
    amount: 'Rp 10.000.000',
    createAt: 1440016400000,
    status: 'Pending'
  },
  {
    id: uuid(),
    from: 'E',
    to: 'F',
    amount: 'Rp 50.000.000',
    createAt: 1555016400000,
    status: 'Failed'
  },
  {
    id: uuid(),
    from: 'G',
    to: 'H',
    amount: 'Rp 250.000.000',
    createAt: 1555016400000,
    status: 'Done'
  },
];
