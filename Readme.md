# Part 1: Findings

## Issue 1

**Category:** SRP (Single Responsibility Principle)

**Problem:**
`OrderService` performs multiple responsibilities:

* Validation
* Calculation
* Persistence
* Logging

**Impact:**

* Difficult to maintain and understand.
* Difficult to test.
* Any change in database persistence, calculation rules, or validation logic affects the same class.

**Suggested Fix:**

Split responsibilities into dedicated modules/classes:

* OrderValidator
* OrderRepository
* OrderService
* PricingService
* DiscountService
* AuditService

---

## Issue 2

**Category:** OCP (Open Closed Principle) Violation & Code Smell

**Problem:**
Delivery charges and discount tiers are hardcoded.

Example:

```javascript
if(order.deliveryType === "STANDARD")
```

**Impact:**

Adding a new delivery type or discount tier requires modifying the existing `createOrder()` implementation, increasing the risk of introducing bugs.

**Suggested Fix:**

Implement configuration maps or a Strategy Pattern.

```javascript
const DELIVERY_CHARGES = {
    STANDARD: 50,
    EXPRESS: 150,
    SAME_DAY: 300
};
```

This allows new delivery types to be added without modifying business logic.

---

## Issue 3

**Category:** Tight Coupling

**Problem:**
`OrderService` directly depends on global in-memory storage.

Example:

```javascript
const orders = [];
```

If storage is migrated to a database, persistence logic must be rewritten within the same class.

**Impact:**

* Cannot easily replace storage with MongoDB, MySQL, or any other database.
* Violates separation of concerns.

**Suggested Fix:**

Introduce a Repository layer and inject it into `OrderService`.

```javascript
constructor(orderRepository) {
    this.orderRepository = orderRepository;
}
```

---

## Issue 4

**Category:** Magic Numbers

**Problem:**
Values are hardcoded directly into calculations and conditions.

Examples:

```javascript
50
150
300
10000
50000
0.10
0.15
```

**Impact:**

* Hard to understand.
* Hard to maintain.
* Difficult to update business rules.

**Suggested Fix:**

Move values to named constants.

```javascript
const STANDARD_DELIVERY_CHARGE = 50;
const TEN_PERCENT_DISCOUNT = 0.10;
```

---

## Issue 5

**Category:** Weak Validation

**Problem:**

* Email validation only checks `indexOf("@")`.
* No validation for:

  * Quantity
  * Price
  * SKU format

**Impact:**

Invalid data can be processed:

* Invalid emails
* Invalid SKUs
* Negative quantities
* Negative prices

**Suggested Fix:**

Implement robust validation rules:

* Email Regex Validation
* SKU Regex Validation
* Quantity > 0
* Price > 0

Example SKU Regex:

```regex
^[A-Z0-9_-]{3,20}$
```

---

## Issue 6

**Category:** Business Logic Bug

**Problem:**
Discount logic evaluates multiple rules sequentially.

Example:

```javascript
if(total > 10000)

if(total > 50000)
```

For totals above 50,000, both conditions are true.

**Impact:**

Multiple discounts may be applied, resulting in incorrect calculations.

**Suggested Fix:**

Apply only the highest applicable discount.

```javascript
if(total > 50000){
    discount = total * 0.15;
}
else if(total > 10000){
    discount = total * 0.10;
}
```

---

## Issue 7

**Category:** Testability Issues

**Problem:**
The `orders` array is a global mutable variable shared across all executions.

```javascript
const orders = [];
```

Every test modifies the same shared state.

**Impact:**

* Tests become dependent on execution order.
* Parallel execution may produce unreliable results.
* Difficult to mock or isolate behavior.

**Suggested Fix:**

Inject a repository instance into `OrderService`.

This allows tests to:

* Use fresh repositories.
* Mock repositories.
* Run independently.

---

## Issue 8

**Category:** Missing Audit Trail

**Problem:**
No audit records are maintained for order operations.

**Impact:**

* Cannot track order history.
* No visibility into user actions.
* Difficult to debug or investigate issues.

**Suggested Fix:**

Create an `AuditService` to record events:

* ORDER_CREATED
* ORDER_UPDATED
* ORDER_CANCELLED

Store audit records in memory and expose retrieval methods for reporting and debugging.


## AI Usage Report

### Prompt Used

> Generate a JavaScript function to calculate the subtotal of an order by summing item price × quantity for all items.

### AI Generated Code

```javascript
const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
);
```

### Changes Made

- Integrated the calculation into the `OrderService`.
- Added validation to ensure item price and quantity are positive values before calculation.

### Why Changes Were Required

- To fit the project's business rules and validation requirements.
- To improve readability and maintainability compared to a traditional `for` loop.