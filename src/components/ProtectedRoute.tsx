import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {isLoggedIn} from '../services/auth-service'; 

type Props = {
  children: JSX.Element,
};

export const ProtectedRoute = ({ children }: Props) => {
  const navigate = useNavigate();
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const logged = isLoggedIn();

  useEffect(() => {
    console.log({logged});
    if (!logged)  navigate('/login');

    // setIsAuthenticated(logged);
  },[logged]);
  /*
  if(isAuthenticated) {
    navigate('/login');
  }
  */
  
  
  return children;
};