import { faker } from "@faker-js/faker/locale/es";

// Función para generar fechas aleatorias en un rango
function getRandomDate(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomDate = new Date(
    startDate + Math.random() * (endDate - startDate)
  );
  return randomDate.toISOString().split("T")[0];
}

// Función para crear un movimiento
function createMovement(amount, date) {
  return {
    amount,
    date,
    type: amount > 0 ? "deposit" : "withdrawal",
    id: Math.random().toString(36).substr(2, 9), // ID único para cada movimiento
  };
}

// Función para generar movimientos con fechas aleatorias
function generateMovementsWithRandomDates(amounts, startDate, endDate) {
  return amounts.map((amount) =>
    createMovement(amount, getRandomDate(startDate, endDate))
  );
}

// Función para generar una cuenta bancaria aleatoria
function generateRandomAccount() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const fullName = `${firstName} ${lastName}`;

  // Generar username (iniciales del nombre y apellido en minúsculas)
  const username = (firstName.charAt(0) + lastName.charAt(0)).toLowerCase().replace(/[áéíóúñ]/g, c => {
    const chars = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n' };
    return chars[c] || c;
  });

  // Generar entre 5 y 10 movimientos aleatorios
  const numMovements = faker.number.int({ min: 5, max: 10 });
  const movements = [];

  for (let i = 0; i < numMovements; i++) {
    const amount = Math.round(faker.number.float({
      min: -1000,
      max: 5000,
      multipleOf: 0.01
    }) * 100) / 100; // Asegurar 2 decimales
    movements.push(
      createMovement(
        amount,
        faker.date
          .between({
            from: "2024-01-01",
            to: "2025-03-06",
          })
          .toISOString()
          .split("T")[0]
      )
    );
  }

  return {
    owner: fullName,
    username: username,  // Agregamos el username
    movements: movements,
    interestRate: Math.round(faker.number.float({ 
      min: 0.5, 
      max: 2.0, 
      multipleOf: 0.1 
    }) * 10) / 10, // Asegurar 1 decimal
    pin: faker.number.int({ min: 1000, max: 9999 }),
  };
}

// Generar 4 cuentas aleatorias
const accounts = Array.from({ length: 4 }, () => generateRandomAccount());

// Mostrar información de las cuentas generadas
console.log('Cuentas generadas:');
accounts.forEach(account => {
  console.log(`Usuario: ${account.username}, PIN: ${account.pin}, Nombre: ${account.owner}`);
});

export { accounts as default, createMovement, generateRandomAccount };
