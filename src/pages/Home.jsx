import NavbarComponent from '../components/Navbar';
import EventList from '../components/EventList';
import UpcomingEvents from '../components/UpcomingEvents';
import InfiniteCategory from '../components/InfintyCategory';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarComponent />
      <InfiniteCategory />
      <hr></hr>
      <div className="flex-grow w-full px-5 mt-4">
        <UpcomingEvents />
        <EventList />
      </div>
    </div>
  );
};

export default Home;
