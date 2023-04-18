import { NavLink, Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";

import usePrimaryStore from "../state";

const OutletWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const RootWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SidebarWrapper = styled.nav`
  display: flex;
  width: 40vw;
  max-width: 196px;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  background-color: #3b4252;
  padding-top: 6px;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  gap: 8px;
  padding-left: 10px;
  background-color: ${(properties: { isactive: boolean }) =>
    properties.isactive ? "#545f75" : "#434c5e"};
  color: white;
  border: 0;
  height: 48px;
  align-items: center;
  width: 100%;
  font-weight: 500;
  text-decoration: none;
  &:hover {
    background-color: #545f75;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  font-stretch: 2rem;
  width: 40vw;
  max-width: 196px;
  text-align: center;
  color: #88c0d0;
`;

const Courses = styled.ul`
  position: relative;
  top: -16px;
  list-style-type: none;
  color: #fff;
  margin: 0;
  background-color: #4a5466;
`;

const CourseButton = styled.button`
  border: none;
  padding: none;
  margin: none;
  width: 100%;
  text-align: left;
  background-color: ${(properties: { isactive: boolean }) =>
    properties.isactive ? "#545f75" : "#4a5466"};
  &:hover {
    background-color: #545f74;
  }
`;

function RootTemplate() {
  const { pathname } = useLocation();
  const state = usePrimaryStore();
  return (
    <RootWrapper>
      <SidebarWrapper>
        <Header>
          <img
            alt="Cut Your Losses Logo"
            height={100}
            src="/logo.png"
            width={100}
          />
        </Header>
        <SidebarLink isactive={pathname === "/dashboard"} to="/dashboard">
          <svg
            fill="none"
            height="21"
            viewBox="0 0 19 19"
            width="21"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M0.125 0.125V8.45833H8.45833V0.125H0.125ZM6.375 6.375H2.20833V2.20833H6.375V6.375ZM0.125 10.5417V18.875H8.45833V10.5417H0.125ZM6.375 16.7917H2.20833V12.625H6.375V16.7917ZM10.5417 0.125V8.45833H18.875V0.125H10.5417ZM16.7917 6.375H12.625V2.20833H16.7917V6.375ZM10.5417 10.5417V18.875H18.875V10.5417H10.5417ZM16.7917 16.7917H12.625V12.625H16.7917V16.7917Z"
              fill="#ECEFF4"
              fillRule="evenodd"
            />
          </svg>
          <span>Dashboard</span>
        </SidebarLink>
        <SidebarLink isactive={pathname === "/grades"} to="/grades">
          <svg
            fill="none"
            height="23"
            viewBox="0 0 21 21"
            width="23"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 6.3H4.5V21H0V6.3ZM8.4 0H12.6V21H8.4V0ZM16.8 12H21V21H16.8V12Z"
              fill="#ECEFF4"
            />
          </svg>
          <span>Grades</span>
        </SidebarLink>
        {pathname === "/grades" && (
          <Courses>
            {state.courses.map((course, index) => (
              <li key={course.id}>
                <CourseButton
                  isactive={index === state.currentCourse}
                  onClick={() => {
                    state.setCurrentCourse(index);
                  }}
                  type="button"
                >
                  {course.name}
                </CourseButton>
              </li>
            ))}
          </Courses>
        )}
        <SidebarLink isactive={pathname === "/calculators"} to="/calculators">
          <svg
            fill="none"
            height="23"
            viewBox="0 0 25 25"
            width="23"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_12_40)">
              <path
                d="M19.7917 3.125H5.20833C4.0625 3.125 3.125 4.0625 3.125 5.20833V19.7917C3.125 20.9375 4.0625 21.875 5.20833 21.875H19.7917C20.9375 21.875 21.875 20.9375 21.875 19.7917V5.20833C21.875 4.0625 20.9375 3.125 19.7917 3.125ZM13.5729 7.35417L14.6771 6.25L16.1458 7.71875L17.6146 6.25L18.7187 7.35417L17.25 8.82292L18.7187 10.2917L17.6146 11.3958L16.1458 9.9375L14.6771 11.4062L13.5729 10.3021L15.0417 8.83333L13.5729 7.35417ZM6.51042 8.04167H11.7188V9.60417H6.51042V8.04167ZM11.9792 16.6667H9.89583V18.75H8.33333V16.6667H6.25V15.1042H8.33333V13.0208H9.89583V15.1042H11.9792V16.6667ZM18.75 17.9687H13.5417V16.4062H18.75V17.9687ZM18.75 15.3646H13.5417V13.8021H18.75V15.3646Z"
                fill="#ECEFF4"
              />
            </g>
            <defs>
              <clipPath id="clip0_12_40">
                <rect fill="white" height="25" width="25" />
              </clipPath>
            </defs>
          </svg>
          <span>Calculators</span>
        </SidebarLink>
      </SidebarWrapper>
      <OutletWrapper>
        <Outlet />
      </OutletWrapper>
    </RootWrapper>
  );
}

export default RootTemplate;
