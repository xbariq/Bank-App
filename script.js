'use strict';

const today = new Date();
let yesterday = new Date(today);
yesterday = yesterday.setDate(today.getDate() - 1);

console.log(yesterday);
// Data
const account1 = {
  owner: 'Aya Malik',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2023-02-15T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-07-26T17:01:17.194Z',
    yesterday,
    new Date(),
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    yesterday,
    new Date(),
  ],
};

const accounts = [account1, account2];

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

const displayMovements = function (acc, sort = false) {
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  containerMovements.innerHTML = '';
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const now = new Date();
    let dateBank =
      (new Date(acc.movementsDates[i]) - now) / (1000 * 60 * 60 * 24);
    dateBank = Math.ceil(Math.abs(dateBank));
    console.log(dateBank);
    const date = new Date(acc.movementsDates[i]);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const day = `${date.getDate()}`.padStart(2, 0);
    const displayDates = `${
      dateBank <= 1
        ? `Today`
        : dateBank <= 2
        ? `Yesterday`
        : `${day}/${month}/${year}`
    }`;

    const html = ` <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDates}</div>

     <div class="movements__value">${mov.toFixed(2)} ＄</div>

     
  </div>
        
        `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const euroToUsd = 1.1;

const movementsUsd = movements.map(mov => mov * euroToUsd);

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur) {
    return acc + cur;
  }, 0);
  labelBalance.innerHTML = `${acc.balance.toFixed(2)}＄`;
};

const calcDisplaySummary = function (accounts) {
  const income = accounts.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.innerHTML = `${income.toFixed(2)}＄`;

  const withdraw = accounts.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumOut.textContent = `${Math.abs(withdraw).toFixed(2)}＄ `;
  //only interest more or equal than 1 will be paid
  const interest = accounts.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * accounts.interestRate) / 100)
    .filter(deposit => deposit >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  labelSumInterest.textContent = `${interest.toFixed(2)}＄`;
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

const startTimerLogOut = function () {
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min} : ${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelTimer.textContent = `${min} : ${0}0`;
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'You have been logged out due to inactivity';
    }
    time--;
  };
  let time = 600;
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const updateUi = function (account) {
  displayMovements(account);

  calcPrintBalance(account);

  calcDisplaySummary(account);
};

// log in
let currentAccount, timer;

createUsername(accounts);
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginPin.blur();
    updateUi(currentAccount);
    if (timer) clearInterval(timer);
    timer = startTimerLogOut();

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // create current date of logging in
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const day = `${now.getDate()}`.padStart(2, 0);

    labelDate.textContent = `${day}/${month}/${year}`;
  }
});

// Handle transfers between accounts
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    account => account.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance > amount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    console.log('Transfer done !');

    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString)();
  }
  updateUi(currentAccount);
  clearInterval(timer);
  timer = startTimerLogOut();
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    console.log('okay');
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
  } else {
    alert(
      'Amount requested exceeds the limit, you are allowed to request only 100% above your largest deposit'
    );
  }

  updateUi(currentAccount);
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
  clearInterval(timer);
  timer = startTimerLogOut();
});

//Close account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    console.log('DELETED');
    const accountIndex = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(accountIndex, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Account closed';
  }
});

const accMovements = accounts
  .map(move => move.movements)
  .flat()
  .reduce((accu, cur) => accu + cur, 0);

// sorting movements

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
