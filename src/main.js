import './style.css'
import accounts from './accounts.js'

document.querySelector('#app').innerHTML = `
    <nav>
      <p class="welcome">Log in to get started</p>
      <img src="logo.png" alt="Logo" class="logo" />
      <form class="login" >
        <input
          type="text"
          placeholder="user"
          class="login__input login__input--user"
        />
        <!-- In practice, use type="password" -->
        <input
          type="text"
          placeholder="PIN"
          maxlength="4"
          class="login__input login__input--pin"
        />
        <button class="login__btn">&rarr;</button>
      </form>
    </nav>

    <main class="app">
      <!-- BALANCE -->
      <div class="balance">
        <div>
          <p class="balance__label">Current balance</p>
          <p class="balance__date">
            As of <span class="date">05/03/2037</span>
          </p>
        </div>
        <p class="balance__value">0000€</p>
      </div>

      <!-- MOVEMENTS -->
      <div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--deposit">2 deposit</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">4 000€</div>
        </div>
        <div class="movements__row">
          <div class="movements__type movements__type--withdrawal">
            1 withdrawal
          </div>
          <div class="movements__date">24/01/2037</div>
          <div class="movements__value">-378€</div>
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="summary">
        <p class="summary__label">In</p>
        <p class="summary__value summary__value--in">0000€</p>
        <p class="summary__label">Out</p>
        <p class="summary__value summary__value--out">0000€</p>
        <p class="summary__label">Interest</p>
        <p class="summary__value summary__value--interest">0000€</p>
        <button class="btn--sort">&downarrow; SORT</button>
      </div>

      <!-- OPERATION: TRANSFERS -->
      <div class="operation operation--transfer">
        <h2>Transfer money</h2>
        <form class="form form--transfer">
          <input type="text" class="form__input form__input--to" />
          <input type="number" class="form__input form__input--amount" />
          <button class="form__btn form__btn--transfer">&rarr;</button>
          <label class="form__label">Transfer to</label>
          <label class="form__label">Amount</label>
        </form>
      </div>

      <!-- OPERATION: LOAN -->
      <div class="operation operation--loan">
        <h2>Request loan</h2>
        <form class="form form--loan">
          <input type="number" class="form__input form__input--loan-amount" />
          <button class="form__btn form__btn--loan">&rarr;</button>
          <label class="form__label form__label--loan">Amount</label>
        </form>
      </div>

      <!-- OPERATION: CLOSE -->
      <div class="operation operation--close">
        <h2>Close account</h2>
        <form class="form form--close">
          <input type="text" class="form__input form__input--user" />
          <input
            type="password"
            maxlength="6"
            class="form__input form__input--pin"
          />
          <button class="form__btn form__btn--close">&rarr;</button>
          <label class="form__label">Confirm user</label>
          <label class="form__label">Confirm PIN</label>
        </form>
      </div>

      <!-- LOGOUT TIMER -->
      <p class="logout-timer">
        You will be logged out in <span class="timer">05:00</span>
      </p>
    </main>
`
// Elements
const labelWelcome = document.querySelector('.welcome')
const labelDate = document.querySelector('.date')
const labelBalance = document.querySelector('.balance__value')
const labelSumIn = document.querySelector('.summary__value--in')
const labelSumOut = document.querySelector('.summary__value--out')
const labelSumInterest = document.querySelector('.summary__value--interest')
const labelTimer = document.querySelector('.timer')

const containerApp = document.querySelector('.app')
const containerMovements = document.querySelector('.movements')

const btnLogin = document.querySelector('.login__btn')
const btnTransfer = document.querySelector('.form__btn--transfer')
const btnLoan = document.querySelector('.form__btn--loan')
const btnClose = document.querySelector('.form__btn--close')
const btnSort = document.querySelector('.btn--sort')

const inputLoginUsername = document.querySelector('.login__input--user')
const inputLoginPin = document.querySelector('.login__input--pin')
const inputTransferTo = document.querySelector('.form__input--to')
const inputTransferAmount = document.querySelector('.form__input--amount')
const inputLoanAmount = document.querySelector('.form__input--loan-amount')
const inputCloseUsername = document.querySelector('.form__input--user')
const inputClosePin = document.querySelector('.form__input--pin')


//creamos el campo username para todas las cuentas de usuarios

//usamos forEach para modificar el array original, en otro caso map.
const createUsernameField = function (account) {
  account.forEach (function (account) {
    account.username = account.owner  //juan sanchez
    .toLowerCase()   //coges juan Sanchez  y me lo divides
    .split(' ')   //cambia a ['juan', 'sanchez']
    .map(name => name[0]) //cogeriamos el primer elemento ['j','s']
    .join('')
    });
};

createUsernameField(accounts)

btnLogin.addEventListener('click',function (e) {

  //evitar que el formulario se envie
  e.preventDefault();

  //recojo el username y el pin y los comparo con los datos de la cuenta 
  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);

  const account = accounts
  .find((account) => account.username === inputUsername )     //me filtra el elemento y le pongo las dos condiciones


  if (account && account.pin === inputPin) {  //comprueba que objeto exista y si existe comprueba que el pin sea correcto
    containerApp.style.opacity = 100;

    //si esta bien mensaje de bienvenida y que se vea la aplicacion
    labelWelcome.textContent = `Bienvenido, ${account.owner.split(' ')[0]}`
    //limpiar formulario
    inputLoginUsername.value = inputLoginPin.value = '';

  //cargar los datos (movimiento de las cuentas
  updateUI(account);
  }
  else {
    console.log('Credenciales incorrectas')
  }

});

const updateUI = function ({movements}) {  //destructuramos los argumentos de la funcion
  
  //mostrar el balance
 displayMovements(movements);
  //mostrar el balance
  displayBalance(movements);
  //mostrar el resumen
  displaySummary(movements);
};

const displayBalance = function (movements){
  //calculamos la suma de ingresos y retiradas en efectivo
  const balance = movements.reduce(
    (total, movement) => total + movement,
    0
  )
  //actualizamos el DOM
  labelBalance.textContent = `${balance.toFixed(2)}€`; //ajustamos a dos decimales
}

const displayMovements = function (movements) {

}

const displaySummary = function (movements) {
// const =... Ingresos, movimientos>0
  const sumIN= movements
  .filter(movement => movement > 0)
  .reduce((total, movement) => total + movement, 0)
  labelSumIn.textContent = `${sumIN.toFixed(2)}€`;
  // const sumOut =... retirada de dinero moviemientos<0
  const sumOut = movements
  .filter(movement => movement < 0)
  .reduce((total, movement) => total + movement, 0)
  labelSumOut.textContent = `${Math.abs(sumOut).toFixed(2)}€`;
}

