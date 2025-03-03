import { Title } from '@/components/atomic-design/atoms/texts/title';
import { VacationCalendar } from '@/components/vacation-calendar/VacationCalendar';

const Page2 = () => {
  return (
    <div className='h-full w-full'>
      <Title>Page 2</Title>
      <VacationCalendar />
    </div>
  );
};

export default Page2;
