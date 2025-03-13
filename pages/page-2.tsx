import { Title } from '@/components/atomic-design/atoms/texts/title';
import { VacationCalendar } from '@/components/home/vacation-calendar';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

const Page2 = () => {
  return (
    <div className='h-full w-full'>
      {/* <Title>Page 2</Title> */}
      <Header />
      <VacationCalendar />
      <Footer />
    </div>
  );
};

export default Page2;
