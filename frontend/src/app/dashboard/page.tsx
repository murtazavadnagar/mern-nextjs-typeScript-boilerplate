import { redirect } from 'next/navigation';

const DashboardPage = (): never => {
  redirect('/dashboard/users');
};

export default DashboardPage;
