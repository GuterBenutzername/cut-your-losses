import { css } from "@emotion/css";
import { useState } from "react";

import Popup from "../atoms/popup";

const courseButtonStyle = css`
  background-color: #2c2c2c;
  height: 32px;
  border-radius: 8px;
  width: 145px;
  color: #ddd;
  position: relative;
  border: 0;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    background-color: #444;
  }
  &:focus {
    outline: #666 solid 3px;
  }
`;

export default function Popups({
  onImportCsv,
  onImportSchoolCsv,
}: {
  onImportCsv: (csv: string, name: string) => void;
  onImportSchoolCsv: (district: string, csv: string, name: string) => void;
}) {
  const [district, setDistrict] = useState("CISD");
  const [isImportCsvOpen, setIsImportCsvOpen] = useState(false);
  const [importCsv, setImportCsv] = useState("");
  const [importCsvName, setImportCsvName] = useState("");
  const [isImportSchoolOpen, setIsImportSchoolOpen] = useState(false);
  const [importSchoolData, setImportSchoolData] = useState("");
  const [importSchoolName, setImportSchoolName] = useState("");
  return (
    <>
      <div
        className={css`
          position: fixed;
          right: 50%;
          top: 50%;
          z-index: 100;
        `}
      >
        <Popup
          isVisible={isImportCsvOpen}
          onClose={() => {
            setIsImportCsvOpen(false);
          }}
        >
          <p>
            Manually import from CSV (aka copy-paste from Excel) <br />
            The table <i>must</i> have a header row that contains `name`,
            `grade`, `weight`, and `theoretical`, where `grade` and `weight` are
            numbers and `theoretical` is &quot;true&quot; or &quot;false&quot;.
            The column order does not matter.
          </p>
          <br />
          <textarea
            className={css`
              width: 400px;
              height: 350px;
            `}
            onChange={(event) => {
              setImportCsv(event.target.value);
            }}
            value={importCsv}
          />
          <br />
          <p>
            Since encoding the name of the class would make the CSV harder to
            create, please input the name of the class here:
          </p>
          <span
            className={css`
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
            `}
          >
            <span
              className={css`
                position: relative;
              `}
            >
              <label
                className={css`
                  position: absolute;
                  top: -0.8ex;
                  z-index: 1;
                  left: 1rem;
                  background-color: #fff;
                  height: 10px;
                  line-height: 10px;
                  vertical-align: middle;
                  font-size: smaller;
                `}
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                onChange={(event) => {
                  setImportCsvName(event.target.value);
                }}
                value={importCsvName}
              />
            </span>
            <button
              onClick={() => {
                onImportCsv(importCsv, importCsvName);
                setIsImportCsvOpen(false);
                setImportCsv("");
              }}
              type="button"
            >
              Import
            </button>
            <button
              onClick={() => {
                setIsImportCsvOpen(false);
              }}
              type="button"
            >
              Cancel
            </button>
          </span>
        </Popup>
        <Popup
          isVisible={isImportSchoolOpen}
          onClose={() => {
            setIsImportSchoolOpen(false);
          }}
        >
          <p>
            <select
              onChange={(event) => {
                setDistrict(event.target.value);
              }}
              value={district}
            >
              <option value="CISD">Conroe Independent School District</option>
            </select>
          </p>
          <br />
          <textarea
            className={css`
              width: 400px;
              height: 350px;
            `}
            onChange={(event) => {
              setImportSchoolData(event.target.value);
            }}
            value={importSchoolData}
          />
          <br />
          <p>Please input the name of the course the data came from here:</p>
          <span
            className={css`
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
            `}
          >
            <span
              className={css`
                position: relative;
              `}
            >
              <label
                className={css`
                  position: absolute;
                  top: -0.8ex;
                  z-index: 1;
                  left: 1rem;
                  background-color: #fff;
                  height: 10px;
                  line-height: 10px;
                  vertical-align: middle;
                  font-size: smaller;
                `}
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                onChange={(event) => {
                  setImportSchoolName(event.target.value);
                }}
                value={importSchoolName}
              />
            </span>
            <button
              onClick={() => {
                onImportSchoolCsv(district, importSchoolData, importSchoolName);
                setIsImportSchoolOpen(false);
                setImportSchoolData("");
              }}
              type="button"
            >
              Import
            </button>
            <button
              onClick={() => {
                setIsImportSchoolOpen(false);
              }}
              type="button"
            >
              Cancel
            </button>
          </span>
        </Popup>
      </div>
      <button
        className={courseButtonStyle}
        onClick={() => {
          setIsImportCsvOpen(true);
        }}
        type="button"
      >
        Import from CSV
      </button>
      <button
        className={courseButtonStyle}
        onClick={() => {
          setIsImportSchoolOpen(true);
        }}
        type="button"
      >
        Import gradebook
      </button>
      <div
        className={css`
          flex: 1 0 0px;
        `}
      />
    </>
  );
}
