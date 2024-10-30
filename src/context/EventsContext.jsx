import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { myConstant } from "../const/const";

export const EventsContext = createContext();

// Custom hook for accessing EventsContext
// eslint-disable-next-line react-refresh/only-export-components
export const useEventsContext = () => {
    return useContext(EventsContext);
};

export const EventsProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [popularEvents, setPopularEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [inProgressEvents, setInProgressEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all events and specific categories if token is available
    const fetchEvents = async () => {
        const storedData = localStorage.getItem("events-app");
        if (!storedData) {
            setLoading(false);
            return;
        }
        const { token } = JSON.parse(storedData);
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            await Promise.all([
                events.length === 0 && fetchThings(`${myConstant}/api/events`, setEvents, token),
                categories.length === 0 && fetchThings(`${myConstant}/api/category`, setCategories, token),
                upcomingEvents.length === 0 && fetchThings(`${myConstant}/api/events/upcoming-events`, setUpcomingEvents, token),
                popularEvents.length === 0 && fetchThings(`${myConstant}/api/events/popular`, setPopularEvents, token),
                recommendedEvents.length === 0 && fetchThings(`${myConstant}/api/events/recommendation`, setRecommendedEvents, token),
                inProgressEvents.length === 0 && fetchThings(`${myConstant}/api/events/inprogress-events`, setInProgressEvents, token),
            ].filter(Boolean));
        } catch (error) {
            console.error("Error fetching events:", error);
            toast.error("Error fetching events");
        } finally {
            setLoading(false);
        }
    };

    const fetchThings = async (url, setState, token) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data from ${url}`);
            }

            const data = await response.json();
            if(data.data){
                setState(data.data);
            }
            else{
                setState(data);
            }
        } catch (error) {
            console.error(`Error fetching from ${url}:`, error);
            toast.error(`Error fetching from ${url}: ${error.message}`);
        }
    };

    // Fetch events when the context provider is mounted
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <EventsContext.Provider value={{ 
            events, 
            setEvents, 
            categories, 
            setCategories, 
            upcomingEvents, 
            setUpcomingEvents, 
            popularEvents,
            setPopularEvents,
            recommendedEvents,
            setRecommendedEvents,
            inProgressEvents, 
            setInProgressEvents, 
            loading 
        }}>
            {children}
        </EventsContext.Provider>
    );
};
