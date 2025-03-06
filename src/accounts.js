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

// Data
const account1 = {
  owner: "Juan Sánchez",
  movements: generateMovementsWithRandomDates(
    [200, 450, -400, 3000, -650, -130, 70, 1300],
    "2024-01-01",
    "2025-03-06"
  ),
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: "María Portazgo",
  movements: generateMovementsWithRandomDates(
    [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    "2024-01-01",
    "2025-03-06"
  ),
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Estefanía Pueyo",
  movements: generateMovementsWithRandomDates(
    [200, -200, 340, -300, -20, 50, 400, -460],
    "2024-01-01",
    "2025-03-06"
  ),
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Javier Rodríguez",
  movements: generateMovementsWithRandomDates(
    [430, 1000, 700, 50, 90],
    "2024-01-01",
    "2025-03-06"
  ),
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

export { accounts as default, createMovement };
