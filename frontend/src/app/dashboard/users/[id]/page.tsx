import { UserDetailsContainer } from '@/modules/users/containers/user-details-container';

interface Props {
  params: Promise<{ id: string }>;
}

const UserDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  return <UserDetailsContainer userId={id} />;
};

export default UserDetailsPage;
