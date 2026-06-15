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

---


## AI Usage Report

Tools Used -  Github copilot , Claude


### 1. Prompt Used

> Can you suggest a cleaner way to implement `createOrder` so it validates the order, calculates pricing, saves it, and logs the result

**AI Generated Code**

```javascript
async function createOrder(order) {
    const validatedOrder = validateOrder(order);
    const subtotal = calculateSubtotal(validatedOrder.items);
    const discount = calculateDiscount(subtotal);
    const deliveryCharge = getDeliveryCharge(validatedOrder.deliveryType);
    const finalAmount = subtotal - discount + deliveryCharge;
    const savedOrder = {
        ...validatedOrder,
        subtotal,
        discount,
        deliveryCharge,
        finalAmount
    };
    await orderRepository.save(savedOrder);
    auditService.log("ORDER_CREATED", savedOrder.id);
    return savedOrder;
}
```

**Real Code Implemented**

```javascript
async createOrder(order) {
    const validatedOrder = this.orderValidator.validate(order);
    const pricing = this.pricingService.calculate(validatedOrder);
    const savedOrder = {
        ...validatedOrder,
        ...pricing
    };

    await this.repository.save(savedOrder);
    this.auditService.log("ORDER_CREATED", savedOrder.id);

    return savedOrder;
}
```

**Changes Made**

- Instead of the Standalone function in the `OrderService` , create the services for that . 
- Kept pricing inside `PricingService` rather than inline.
- Used injected `repository` and `auditService` objects from the service.

**Why Changes Were Required**

- To adapt the suggestion to the project’s current architecture.
- To ensure the code matched dependency and service patterns.

---


### 2. Prompt Used

> How we can Implement a tiered discount rule for subtotal thresholds

**AI Generated Code**

```javascript
function calculateDiscount(subtotal) {
    let rate = 0;

    if (subtotal > 50000) {
        rate = 0.15;
    } else if (subtotal > 10000) {
        rate = 0.10;
    }

    return subtotal * rate;
}
```

**Real Code Implemented**

```javascript
 calculate(subtotal) {

        if (subtotal > Discount_Rules.High_Discount_Threshold) {
            return (subtotal * Discount_Rules.High_Discount_Percentage
            );
        }

        if ( subtotal >Discount_Rules.Standard_Discount_Threshold) {
            return (subtotal * Discount_Rules.Standard_Discount_Percentage);
        }

        return 0;
    }

```

**Changes Made**

- Create the separte named constant file `DiscountConstant`.
- Kept the tiered quiz logic but placed it inside `DiscountService`.
- Preserved the service class style and export format.

**Why Changes Were Required**

- To centralize discount rules in the existing service and avoid changes in the DiscountService . while we need to  update the discount Tiers

---


### 3. Prompt Used

> How can a repository method be mocked in Jest so that it returns test data without connecting to a real database

**AI Generated Code**

```javascript
const mockOrders = [];
orderRepository.findById = jest.fn().mockReturnValue(
    { id: '1', total: 100 }

);

await orderService.readorder('1');

expect(orderRepository.findById).toHaveBeenCalledWith('1');
expect(result).toEqual(mockOrders[0]);
```

**Real Code Implemented**

```javascript
const repository = {
    findById: jest.fn()
};

repository.findById.mockReturnValue({
    id: 1001,
    subtotal: 51000,
    discount: 7650,
    deliveryCharge: 150,
    finalAmount: 43500
});

const orderService = new OrderService(
    repository,
    {},
    {}
);

const summary = await orderService.generateSummary(1001);

expect(summary).toEqual({
    orderId: 1001,
    subtotal: 51000,
    discount: 7650,
    deliveryCharge: 150,
    finalAmount: 43500
});
expect(summary.finalAmount).toBe(43500);
```

**Changes Made**

- Used the actual test implementation from the project.
- Showed the repository mock being injected into `OrderService`.

**Why Changes Were Required**

- To match the real unit test style used in the codebase to test it should generate summary

---

### 4. Prompt Used

> Can there is some better approch in javascript to modify the calculation of following total insted of using the for loop and let keyword -

   let total = 0;

   for(let i=0;i<order.items.length;i++){
 	total += order.items[i].price * order.items[i].quantity;
   }

### AI Generated Code

```javascript
const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
);
```

### Changes Made

- Integrated the calculation into the `PricingService`.

### Why Changes Were Required

 - Reduce method returns the final value directly, so we can use const instead of mutable let variables while eliminating manual loop index bugs
 - To improve readability and maintainability compared to a traditional `for` loop.

---


### 5. Prompt Used 

> How this OrderService violate the design principle? It currently performs validation, pricing calculation, persistence, and logging.

**AI Generated Suggestion**

- Validation, pricing, persistence, and logging are separate responsibilities.
- Consider extracting pricing and logging into dedicated services.
- Inject dependencies instead of creating them inside the service.

**Real Changes Implemented**

```
const orderService = new OrderService(
    repository,
    pricingService,
    auditService
);
```
**Changes Made**

- Introduced `PricingService`.
- Introduced `AuditService`.
- Used dependency injection.

**Why Changes Were Required**

- To improve maintainability and unit testability.
- To reduce coupling between business logic and databse persistence


