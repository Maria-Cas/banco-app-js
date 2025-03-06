import "./style.css";
import accounts from "./accounts.js";
import moment from "moment";
import "moment/locale/es"; // Importar el idioma español

// Configurar moment en español con textos personalizados
moment.locale("es", {
  relativeTime: {
    future: "en %s",
    past: "hace %s",
    s: "unos segundos",
    m: "un minuto",
    mm: "%d minutos",
    h: "una hora",
    hh: "%d horas",
    d: "un día",
    dd: "%d días",
    M: "un mes",
    MM: "%d meses",
    y: "un año",
    yy: "%d años",
  },
});

document.querySelector("#app").innerHTML = `
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
`;
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  //evitar que el formulario se envie
  e.preventDefault();

  //recojo el username y el pin y los comparo con los datos de la cuenta
  const inputUsername = inputLoginUsername.value;
  const inputPin = Number(inputLoginPin.value);

  currentAccount = accounts.find(
    (account) => account.username === inputUsername
  ); //me filtra el elemento y le pongo las dos condiciones

  if (currentAccount && currentAccount.pin === inputPin) {
    //comprueba que objeto exista y si existe comprueba que el pin sea correcto
    containerApp.style.opacity = 100;

    //si esta bien mensaje de bienvenida y que se vea la aplicacion
    labelWelcome.textContent = `Bienvenido, ${
      currentAccount.owner.split(" ")[0]
    }`;
    //limpiar formulario
    inputLoginUsername.value = inputLoginPin.value = "";

    //cargar los datos (movimiento de las cuentas
    updateUI(currentAccount);
  } else {
    alert(" Credenciales incorrectas. Por favor, inténtalo de nuevo.");
  }
});

/**
 * Actualiza la interfaz de usuario con los datos de la cuenta actual
 * @param {Object} account - Objeto con los datos de la cuenta actual
 */
const updateUI = function (account) {
  // Mostrar el balance
  displayBalance(account.movements);
  // Mostrar los movimientos
  displayMovements(account.movements);
  // Mostrar el resumen
  displaySummary(account.movements);
};

/**
 * Calcula y muestra el balance total de la cuenta
 * @param {Array} movements - Array de movimientos de la cuenta
 */
const displayBalance = function (movements) {
  // Suma todos los importes de los movimientos
  const balance = movements.reduce((total, mov) => total + mov.amount, 0);
  // Muestra el balance con 2 decimales
  labelBalance.textContent = `${balance.toFixed(2)}€`;
};

// Variable para controlar el estado de ordenamiento (true = ascendente, false = descendente)
let sorted = false;

/**
 * Muestra los movimientos en la interfaz de usuario
 * @param {Array} movements - Array de movimientos de la cuenta
 * @param {boolean} sort - Determina si ordenar por fecha (true = ascendente, false = descendente)
 */
const formatRelativeDate = function (date) {
  return moment(date).fromNow(); // Esto mostrará "hace 2 días", "hace 1 hora", etc.
};

const formatFullDate = function (date) {
  return moment(date).format("D [de] MMMM [de] YYYY");
};

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? movements.slice().sort((a, b) => a.amount - b.amount)
    : movements;

  movs.forEach(function (mov, i) {
    const type = mov.type;
    const relativeDate = moment(mov.date).fromNow(); // Esto mostrará "hace 2 días"
    const fullDate = moment(mov.date).format("D [de] MMMM [de] YYYY");

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${
      mov.type
    }</div>
        <div class="movements__date" title="${fullDate}">${relativeDate}</div>
        <div class="movements__value">${mov.amount.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/**
 * Calcula y muestra el resumen de la cuenta (ingresos, gastos e intereses)
 * @param {Array} movements - Array de movimientos de la cuenta
 */
const displaySummary = function (movements) {
  // Calcular suma de ingresos (movimientos positivos)
  const sumIN = movements
    .filter((mov) => mov.amount > 0)
    .reduce((total, mov) => total + mov.amount, 0);
  labelSumIn.textContent = `${sumIN}€`;

  // Calcular suma de gastos (movimientos negativos)
  const sumOut = Math.abs(
    movements
      .filter((mov) => mov.amount < 0)
      .reduce((total, mov) => total + mov.amount, 0)
  );
  labelSumOut.textContent = `${sumOut}€`;

  // Calcular intereses (solo sobre depósitos)
  const interest = movements
    .filter((mov) => mov.amount > 0) // Solo depósitos
    .map((deposit) => (deposit.amount * currentAccount.interestRate) / 100) // Calcular interés
    .filter((int) => int >= 1) // Solo intereses >= 1€
    .reduce((acc, int) => acc + int, 0); // Sumar todos los intereses
  labelSumInterest.textContent = `${interest}€`;
};

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  // Verificar que las credenciales coincidan con la cuenta actual
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const ownerName = currentAccount.owner; // Guardamos el nombre antes de borrar la cuenta

    // Encontrar el índice de la cuenta en el array
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // Eliminar la cuenta del array
    accounts.splice(index, 1);

    // Ocultar la UI y mostrar mensaje de inicio
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";

    // Limpiar los campos
    inputCloseUsername.value = inputClosePin.value = "";

    // Mostrar mensaje de confirmación
    alert(
      `Tu cuenta ha sido cerrada exitosamente. ¡Gracias por usar nuestros servicios!`
    );
  } else {
    alert("Error: Credenciales incorrectas. No se pudo cerrar la cuenta.");
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const currentBalance = currentAccount.movements.reduce(
    (acc, mov) => acc + mov.amount,
    0
  );
  const maxLoanAmount = currentBalance * 2; // 200% del saldo actual

  if (amount > 0 && amount <= maxLoanAmount) {
    // Crear nuevo movimiento como objeto con la fecha actual
    const newMovement = {
      amount: amount,
      date: new Date().toISOString().split("T")[0],
    };

    currentAccount.movements.push(newMovement);
    updateUI(currentAccount);
    inputLoanAmount.value = "";
    alert(`Préstamo aprobado por ${amount}€`);
  } else if (amount <= 0) {
    alert("Error: El movimiento del préstamo debe ser mayor a 0€");
  } else {
    alert(
      `Error: El préstamo no puede superar ${maxLoanAmount}€ (200% de tu saldo actual)`
    );
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (amount > 0 && receiverAccount) {
    // Crear movimientos para ambas cuentas
    const withdrawalMovement = {
      amount: -amount, // Cantidad negativa para la cuenta que envía
      date: new Date().toISOString().split("T")[0],
    };

    const depositMovement = {
      amount: amount, // Cantidad positiva para la cuenta que recibe
      date: new Date().toISOString().split("T")[0],
    };

    // Añadir movimientos a ambas cuentas
    currentAccount.movements.push(withdrawalMovement);
    receiverAccount.movements.push(depositMovement);

    // Actualizar la interfaz
    updateUI(currentAccount);
    inputTransferAmount.value = inputTransferTo.value = "";
    alert(`Transferencia exitosa de ${amount}€ a ${receiverAccount.owner}`);
  } else {
    alert(
      "Error: No se pudo realizar la transferencia. Verifica el movimiento y el destinatario."
    );
  }
});

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);

  // Cambiar el texto y el ícono del botón según el estado
  btnSort.innerHTML = sorted ? "⬆️ SORT" : "⬇️ SORT";
  alert(
    sorted
      ? "Movimientos ordenados de menor a mayor"
      : "Movimientos ordenados por fecha"
  );
});

const startLogOutTimer = function () {
  let time = 300;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 60) {
      alert("¡Atención! Tu sesión se cerrará en 1 minuto por inactividad");
    }

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
      alert("Sesión cerrada por inactividad");
    }
    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
