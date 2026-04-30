import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UsersTable } from './users-table';

describe('UsersTable', () => {
  it('renders users and triggers action handlers', async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    render(
      <UsersTable
        users={[
          {
            id: 'u1',
            fullName: 'John Doe',
            username: 'john',
            email: 'john@example.com',
            role: 'USER',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]}
        page={1}
        limit={10}
        total={1}
        isLoading={false}
        onPageChange={jest.fn()}
        onLimitChange={jest.fn()}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    await user.click(screen.getByLabelText('edit-u1'));
    await user.click(screen.getByLabelText('delete-u1'));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
