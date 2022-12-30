import { BsBell } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import styled from "./Header.module.scss";
import Logo from "../../../assets/logo.svg";
import SearchBar from "../SearchBar";
import Avatar from "../../../assets/avatar.png";

const Header = ({ toggleSidebar }: { toggleSidebar(): void }) => (
    <header className={styled.header}>
        <nav className={styled.nav}>
            <div className={styled.logo__wrapper}>
                <button aria-label="toggle menu" type="button" onClick={toggleSidebar}>
                    <RxHamburgerMenu size={23} />
                </button>
                <img src={Logo} alt="Lend Sqr" />
            </div>
            <div className={styled.header__right}>
                <div className={styled.header__search}>
                    <SearchBar />
                </div>
                <div className={styled.header__content}>
                    <a href="#">Docs</a>
                    <BsBell />

                    <div className={styled.avatar}>
                        <img src={Avatar} alt="" />
                        <p>Adedeji</p>
                    </div>
                </div>
            </div>
        </nav>
    </header>
);

export default Header;
