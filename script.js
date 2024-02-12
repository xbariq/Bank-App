'use strict';

// Data
const account1 = {
  owner: 'Aya Malik',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

console.log();

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// const currencies = new Map([
//   ["USD", "United States dollar"],
//   ["EUR", "Euro"],
//   ["GBP", "Pound sterling"],
// ]);

// console.log(movements[movements.length - 1]);
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = ` <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov} ＄</div>
  </div>
        
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;

console.log();
const movementsUsd = movements.map(mov => mov * euroToUsd);
console.log(movementsUsd);

const calcPrintBalance = function (arr) {
  arr.reduce(function (acc, cur) {
    const balance = acc + cur;
    console.log(balance);
    labelBalance.innerHTML = `${balance}＄`;
    return balance;
  }, 0);
};

const calcDisplaySummary = function (accounts) {
  const income = accounts.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.innerHTML = `${income} ＄`;

  const withdraw = accounts.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(withdraw)} ＄ `;
  //only interest more or equal than 1 will be paid
  const interest = accounts.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accounts.interestRate) / 100)
    .filter(deposit => deposit >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest} ＄`;
};

const arr = [7, 99, 77, 9];

const newA = arr.filter(function (num) {
  return num > 50;
});

const createUsername = function (users) {
  users.forEach(function (user) {
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsername(accounts);

// even  handler

let userName;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('logged in');
  userName = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(userName);
  if (userName?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${userName.owner.split(' ')[0]}`;
  }
  containerApp.style.opacity = 100;

  inputLoginUsername.value = inputLoginPin.value = '';

  inputLoginPin.blur();

  displayMovements(userName.movements);

  calcPrintBalance(userName.movements);

  calcDisplaySummary(userName);
});
