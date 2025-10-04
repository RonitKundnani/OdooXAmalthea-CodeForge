-- Sample Data for Testing Expense Management System
-- Run this AFTER creating your first admin account through the signup form

USE expense_management;

-- Note: Replace company_id = 1 with your actual company_id from the companies table
-- You can check it with: SELECT * FROM companies;

-- Sample Manager User (password: manager123)
-- Password hash for 'manager123' with bcrypt
INSERT INTO users (company_id, name, email, password_hash, role) VALUES
(1, 'Sarah Johnson', 'manager@company.com', '$2a$10$YourHashHere', 'manager');

-- Sample Employee Users (password: employee123)
INSERT INTO users (company_id, name, email, password_hash, role) VALUES
(1, 'John Smith', 'john@company.com', '$2a$10$YourHashHere', 'employee'),
(1, 'Emily Davis', 'emily@company.com', '$2a$10$YourHashHere', 'employee'),
(1, 'Michael Brown', 'michael@company.com', '$2a$10$YourHashHere', 'employee');

-- Manager Relationships (Sarah manages John, Emily, and Michael)
-- Note: Replace manager_id and employee_id with actual user_id values
INSERT INTO manager_relationships (employee_id, manager_id) VALUES
(3, 2),  -- John reports to Sarah
(4, 2),  -- Emily reports to Sarah
(5, 2);  -- Michael reports to Sarah

-- Sample Expenses
-- Note: Replace user_id and company_id with actual values
INSERT INTO expenses (user_id, company_id, amount_original, currency_code, amount_converted, category, description, expense_date, status) VALUES
-- John's expenses
(3, 1, 45.50, 'USD', 45.50, 'Travel', 'Taxi to client meeting', '2025-09-15', 'approved'),
(3, 1, 120.00, 'USD', 120.00, 'Meals', 'Team lunch with clients', '2025-09-16', 'approved'),
(3, 1, 85.00, 'USD', 85.00, 'Office Supplies', 'Laptop accessories', '2025-09-20', 'pending'),

-- Emily's expenses
(4, 1, 250.00, 'USD', 250.00, 'Travel', 'Flight to conference', '2025-09-10', 'approved'),
(4, 1, 65.00, 'USD', 65.00, 'Meals', 'Client dinner', '2025-09-18', 'approved'),
(4, 1, 30.00, 'USD', 30.00, 'Transportation', 'Uber rides', '2025-09-22', 'pending'),

-- Michael's expenses
(5, 1, 180.00, 'USD', 180.00, 'Training', 'Online course subscription', '2025-09-05', 'approved'),
(5, 1, 95.00, 'USD', 95.00, 'Office Supplies', 'Ergonomic mouse and keyboard', '2025-09-12', 'rejected'),
(5, 1, 50.00, 'USD', 50.00, 'Meals', 'Working lunch', '2025-09-25', 'pending');

-- Sample Approval Flow (Sequential approval by manager)
INSERT INTO approval_flows (company_id, name, approval_type) VALUES
(1, 'Standard Manager Approval', 'sequential');

-- Approval Steps (Manager approves)
INSERT INTO approval_steps (flow_id, approver_id, step_order) VALUES
(1, 2, 1);  -- Sarah (manager) is the approver

-- Sample Expense Approvals (for pending expenses)
INSERT INTO expense_approvals (expense_id, approver_id, step_id, status) VALUES
(3, 2, 1, 'pending'),  -- John's pending expense
(6, 2, 1, 'pending'),  -- Emily's pending expense
(9, 2, 1, 'pending');  -- Michael's pending expense

-- Audit Logs
INSERT INTO audit_logs (user_id, action, entity_id) VALUES
(3, 'EXPENSE_CREATED', 1),
(3, 'EXPENSE_CREATED', 2),
(3, 'EXPENSE_CREATED', 3),
(4, 'EXPENSE_CREATED', 4),
(4, 'EXPENSE_CREATED', 5),
(4, 'EXPENSE_CREATED', 6),
(5, 'EXPENSE_CREATED', 7),
(5, 'EXPENSE_CREATED', 8),
(5, 'EXPENSE_CREATED', 9),
(2, 'EXPENSE_APPROVED', 1),
(2, 'EXPENSE_APPROVED', 2),
(2, 'EXPENSE_APPROVED', 4),
(2, 'EXPENSE_APPROVED', 5),
(2, 'EXPENSE_APPROVED', 7),
(2, 'EXPENSE_REJECTED', 8);

-- Verify data
SELECT 'Companies:' as Info, COUNT(*) as Count FROM companies
UNION ALL
SELECT 'Users:', COUNT(*) FROM users
UNION ALL
SELECT 'Expenses:', COUNT(*) FROM expenses
UNION ALL
SELECT 'Pending Expenses:', COUNT(*) FROM expenses WHERE status = 'pending'
UNION ALL
SELECT 'Approved Expenses:', COUNT(*) FROM expenses WHERE status = 'approved'
UNION ALL
SELECT 'Rejected Expenses:', COUNT(*) FROM expenses WHERE status = 'rejected';

-- Show all users
SELECT user_id, name, email, role FROM users ORDER BY role, name;

-- Show all expenses with user names
SELECT 
    e.expense_id,
    u.name as employee_name,
    e.amount_original,
    e.currency_code,
    e.category,
    e.description,
    e.expense_date,
    e.status
FROM expenses e
JOIN users u ON e.user_id = u.user_id
ORDER BY e.expense_date DESC;
