import React, { useEffect, useRef, useState } from "react";
import {
  MapPinIcon,
  PlusCircleIcon,
  GlobeAsiaAustraliaIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import debounce from "lodash.debounce";
import apiClient from "../http-common";

export default function SearchInput({
  value,
  onChange,
  isMultiSelect,
  selectedOptions,
  placeholder,
  disabled,
}) {
  const [text, setText] = useState(value);

  const search = async (val) => {
    try {
      const {
        data: { locations },
      } = await apiClient.get("api/search/locations", {
        params: {
          index: "cities",
          term: val || "",
        },
      });
      setOptions(locations);
    } catch {
      setOptions([]);
    }
  };
  const debouncedSearch = useRef(
    debounce((nextValue) => search(nextValue), 1000)
  );

  const [options, setOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [cursor, setCursor] = useState(-1);
  const ref = useRef();

  const select = (option) => {
    if (isMultiSelect) {
      const immutVal = [...selectedOptions];
      const findOption = selectedOptions.find((i) => i.id === option.id);
      if (!findOption) {
        onChange(immutVal.concat(option));
        setText("");
      }
    } else {
      onChange(option);
    }

    setShowOptions(false);
  };

  const handleChange = (text) => {
    if (!text) {
      onChange(isMultiSelect ? [] : "");
    }
    setText(text);
    debouncedSearch.current(text);
    setCursor(-1);
    if (!showOptions) {
      setShowOptions(true);
    }
  };

  const moveCursorDown = () => {
    if (cursor < options.length - 1) {
      setCursor((c) => c + 1);
    }
  };

  const moveCursorUp = () => {
    if (cursor > 0) {
      setCursor((c) => c - 1);
    }
  };
  useEffect(() => {
    setText(value);
  }, [value]);
  const handleNav = (e) => {
    switch (e.key) {
      case "ArrowUp":
        moveCursorUp();
        break;
      case "ArrowDown":
        moveCursorDown();
        break;
      case "Enter":
        if (cursor >= 0 && cursor < options.length) {
          select(options[cursor]);
        }
        break;
      default:
      // Todo
    }
  };

  useEffect(() => {
    const listener = (e) => {
      if (!ref.current.contains(e.target)) {
        setShowOptions(false);
        setCursor(-1);
      }
    };

    document.addEventListener("click", listener);
    document.addEventListener("focusin", listener);
    return () => {
      document.removeEventListener("click", listener);
      document.removeEventListener("focusin", listener);
    };
  }, []);

  const removeMultiSelectOption = (id) => {
    onChange(selectedOptions.filter((i) => i.id !== id));
  };
  return (
    <div className="relative" ref={ref}>
      {!isMultiSelect && (
        <>
          <div className="absolute top-4 left-3">
            <MapPinIcon className="h-6 w-6 text-blue-500" />
          </div>
          <input
            type="text"
            className="h-14 w-72 md:w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none"
            placeholder={placeholder}
            value={text}
            onChange={(e) => !disabled && handleChange(e.target.value)}
            onFocus={() => !disabled && setShowOptions(true)}
            onKeyDown={!disabled && handleNav}
            disabled={disabled}
          ></input>
        </>
      )}
      {isMultiSelect && (
        <div className="flex border border-gray-200 bg-white rounded-lg w-72 md:w-96">
          <div className="flex flex-col w-full">
            <div className="flex-1 flex pl-4">
              <GlobeAsiaAustraliaIcon className="h-6 w-6 text-blue-500 self-center" />
              <input
                placeholder={placeholder}
                value={text}
                onChange={(e) => !disabled && handleChange(e.target.value)}
                onFocus={() => !disabled && setShowOptions(true)}
                onKeyDown={!disabled && handleNav}
                disabled={disabled}
                className="bg-transparent w-full p-1 px-2 appearance-none outline-none h-full text-gray-800 z-0 h-14"
              ></input>
            </div>
            {/* <div className="absolute top-2 right-2">
              <button className="h-10 w-20 text-white rounded-lg bg-blue-500 hover:bg-blue-400">
                Search
              </button>
            </div> */}
            <div
              className={`flex flex-1 pl-4 mr-1 flex-wrap w-full ${
                selectedOptions.length > 0 && "border-t-2"
              }`}
            >
              {selectedOptions.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-teal-700 bg-teal-100 border border-teal-300 "
                >
                  <div className="text-xs font-semibold leading-none max-w-full flex-initial">
                    {item.name}
                  </div>
                  <div
                    className="flex flex-auto flex-row-reverse cursor-pointer"
                    onClick={() => removeMultiSelectOption(item.id)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <ul
        className={`absolute w-full rounded-lg shadow-lg bg-white top-[110%] z-50 ${
          !showOptions && "hidden"
        } select-none`}
      >
        {options.length > 0 ? (
          options.map((option, i, arr) => {
            let className = "px-4 hover:bg-blue-100 ";

            if (i === 0) className += "pt-2 pb-1 rounded-t-lg";
            else if (i === arr.length) className += "pt-1 pb-2 rounded-b-lg";
            else if (i === 0 && arr.length === 1)
              className += "py-2 rounded-lg";
            else className += "py-1";

            if (cursor === i) {
              className += " bg-blue-100 border-inherit";
            }

            return (
              <li
                className={`flex w-full justify-between hover:cursor-pointer ${className}`}
                key={option.id}
                onClick={() => select(option)}
              >
                {option.name}
                {isMultiSelect && (
                  <PlusCircleIcon className="h-6 w-6 text-blue-500" />
                )}
              </li>
            );
          })
        ) : (
          <li className="px-4 py-2 text-gray-500">No results</li>
        )}
      </ul>
    </div>
  );
}
