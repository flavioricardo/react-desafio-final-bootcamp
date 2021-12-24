import React, { useState, useEffect } from "react";
import axios from "axios";
import { nanoid } from "nanoid";
import "./App.css";

const App = () => {
  const yearsSelect = [
    2003,
    2004,
    2005,
    2006,
    2007,
    2008,
    2009,
    2010,
    2011,
    2012,
    2013,
    2014,
    2015,
    2016
  ];
  const [yearSelected, setYearSelected] = useState();
  const [yearData, setYearData] = useState([]);
  const [teamsScore, setTeamsScore] = useState([]);
  const [error, setError] = useState("");

  async function getYearData(year) {
    try {
      const response = await axios.get(`http://localhost:3001/${year}`);
      if (response.status === 200 && response.data) {
        setYearData(response.data[response.data.length - 1].partidas);
      }
    } catch (error) {
      setYearData([]);
      console.error(error);
      setError(`${error.response.status} ${error.response.statusText}`);
    }
  }

  useEffect(() => {
    if (yearSelected) getYearData(yearSelected);
    else setYearData([]);
  }, [yearSelected]);

  useEffect(() => {
    if (yearData.length) {
      const arrTeamsScore = [];
      yearData.forEach(partida => {
        if (!arrTeamsScore.includes(partida.mandante)) {
          arrTeamsScore.push({
            name: partida.mandante,
            score: partida.pontuacao_geral_mandante
          });
        }
        if (!arrTeamsScore.includes(partida.visitante)) {
          arrTeamsScore.push({
            name: partida.visitante,
            score: partida.pontuacao_geral_visitante
          });
        }
      });

      setTeamsScore(
        arrTeamsScore.sort(
          (x, y) => y.score.total_pontos - x.score.total_pontos
        )
      );
    } else {
      setTeamsScore([]);
    }
  }, [yearData]);

  const normalizeName = name => {
    if (!name) return name;
    return name
      .replace(/\s|_|\(|\)/g, "_")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="Title">
          <h1>Campeonato Brasileiro</h1>
        </div>
        <div className="Select">
          <select onChange={event => setYearSelected(event.target.value)}>
            <option value="">Selecione o ano</option>
            {yearsSelect.map(year => {
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="Body">
        {teamsScore && teamsScore.length ? (
          <>
            <h3>Classificação</h3>
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td>Time</td>
                  <td>Pontos</td>
                  <td>Vitórias</td>
                  <td>Empates</td>
                  <td>Derrotas</td>
                  <td>Gols pró</td>
                  <td>Gols contra</td>
                  <td>Saldo de gols</td>
                </tr>
              </thead>
              <tbody>
                {teamsScore.map((team, index) => {
                  return (
                    <tr key={nanoid()}>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          src={`./img/${normalizeName(team.name)}.png`}
                          alt={team.name}
                        />
                        {team.name}
                      </td>
                      <td>{team.score.total_pontos}</td>
                      <td>{team.score.total_vitorias}</td>
                      <td>{team.score.total_empates}</td>
                      <td>{team.score.total_derrotas}</td>
                      <td>{team.score.total_gols_marcados}</td>
                      <td>{team.score.total_gols_sofridos}</td>
                      <td>
                        {team.score.total_gols_marcados -
                          team.score.total_gols_sofridos}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : null}
        {error && <div className="Error">{error}</div>}
      </div>
    </div>
  );
};

export default App;
