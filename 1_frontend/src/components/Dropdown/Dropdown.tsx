"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { getAllUsers } from "../../redux/actions/userActions.js";

import styledDropdown from "./Dropdown.module.css";

interface Props {
  handleFilter: (e: any) => void;
  type: "api" | "db";
}

const Dropdown: React.FC<Props> = ({ handleFilter, type }) => {
  // state
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  // -- Selector/Dispatch
  const dataFromDb = useSelector((state: any) => state.getall);
  const userState = useSelector((state: any) => state.user);

  const dispatch = useDispatch<any>();

  // Variables
  const optionsList = dataFromDb?.user?.filter((item: string) => {
    return userState?.loggedIn ? item !== userState.name : item;
  });
  optionsList?.unshift(
    `${userState?.loggedIn ? userState.name : "Make a list"}`
  );

  // Side effects
  useEffect(() => {
    if (!mounted) {
      dispatch(getAllUsers());
      setMounted(true);
    }
    if (type === "api") {
      setIsFirstLoad(true);
      setSelectedOption(0);
    }
  }, [mounted, type]);

  // functions
  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const setSelectedThenCloseDropdown = (index: number) => {
    setIsFirstLoad(false);

    if (index !== selectedOption || isFirstLoad) {
      handleFilter(optionsList[index]);
      setSelectedOption(index);
      setIsOptionsOpen(false);
    }
  };

  const handleKeyDown = (index: number) => (e: any) => {
    switch (e.key) {
      case " ":
      case "SpaceBar":
      case "Enter":
        e.preventDefault();
        setSelectedThenCloseDropdown(index);
        break;
      default:
        break;
    }
  };

  const handleListKeyDown = (e: any) => {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setIsOptionsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className={styledDropdown.wrapper}>
      <div className={styledDropdown.container}>
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOptionsOpen}
          className={`${styledDropdown.button} ${
            isOptionsOpen ? styledDropdown.expanded : ""
          }`}
          onClick={toggleOptions}
          onKeyDown={handleListKeyDown}
        >
          {isFirstLoad
            ? "Movies lists"
            : type === "db"
            ? optionsList[selectedOption]
            : "Movies lists"}
          {isOptionsOpen ? (
            <motion.span
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: [-20, 0], opacity: [0, 1] }}
              exit={{ y: 20, opacity: 0 }}
            >
              <IoIosArrowDown />
            </motion.span>
          ) : (
            <motion.span
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: [20, 0], opacity: [0, 1] }}
              exit={{ y: -20, opacity: 0 }}
            >
              <IoIosArrowUp />
            </motion.span>
          )}
        </button>
        {optionsList && (
          <motion.ul
            initial={{ scaleY: 0, opacity: 1 }}
            animate={{
              scaleY: isOptionsOpen ? [0, 1] : [1, 0],
              opacity: [0, 1],
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            style={{ transformOrigin: "top", overflow: "hidden" }}
            className={`${styledDropdown.optionsList} ${
              isOptionsOpen ? styledDropdown.show : ""
            }`}
            role="listbox"
            aria-activedescendant={optionsList[selectedOption]}
            tabIndex={-1}
            onKeyDown={handleListKeyDown}
          >
            {optionsList.map((option: string, index: number) => (
              <motion.li
                whileInView={{ y: [-10 * index, 0], opacity: [0, 1] }}
                initial={{ y: 0, opacity: 0 }}
                transition={{ delay: 0.08 * index }}
                viewport={{ once: true }}
                exit={{ y: -10 }}
                key={option}
                id={option}
                role="option"
                aria-selected={selectedOption === index}
                tabIndex={0}
                onKeyDown={handleKeyDown(index)}
                onClick={() => setSelectedThenCloseDropdown(index)}
                className={`${styledDropdown.option} ${
                  selectedOption === index &&
                  isFirstLoad === false &&
                  styledDropdown.selectedOption
                }`}
              >
                {option}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
