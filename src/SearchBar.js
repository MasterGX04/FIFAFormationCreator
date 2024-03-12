import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import FIFAData from './resources/FIFA23FullInfo.csv';
import Flags from './resources/CountryFlags.csv';
import Logos from './resources/ClubLogos.csv';
import unaccent from 'unaccent';

const SearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [playerData, setPlayerData] = useState([]);

    const [playersPerPage] = useState(10);
    const [numPages, setNumPages] = useState(0);
    const [numResults, setNumResults] = useState(0);
    const [filtered, setFiltered] = useState([]);

    //Variables for countryFlags and clubLogos from .csv files
    const [flags, setFlags] = useState([]);
    const [logos, setLogos] = useState([]);

    useEffect(() => {
        //Parses flags
        Papa.parse(Flags,  {
            download: true,
            header: true,
            complete: function (results) {
                const flagInfo = results.data.map(row => {
                    return {
                        nationality: row.Nationality,
                        flag: row.Flag
                    }
                });
                setFlags(flagInfo);
            }
        });

        //Parses club logos
        Papa.parse(Logos,  {
            download: true,
            header: true,
            complete: function (results) {
                const clubInfo = results.data.map(row => {
                    return {
                        club: row.Club,
                        logo: row['Club Logo']
                    }
                });
                setLogos(clubInfo);
            }
        });
    }, []);
    useEffect(() => {
        //Parses info information
        Papa.parse(FIFAData, {
            download: true,
            header: true,
            complete: function (results) {
                const playerStuff = results.data.map(row => {
                    const player = {
                        name: row.Name,
                        fullName: row['Long Name'],
                        age: row.Age,
                        photo: row.Photo,
                        nationality: row.Nationality,
                        flag: row.Flag,
                        overall: row.Overall,
                        potential: row.Potential,
                        club: row.Club,
                        clubLogo: row['Club Logo'],
                        position: row.Position,
                        currentPosition: '',
                        prefFoot: row['Preferred Foot'],
                        pace: row.pace,
                        shooting: row.shooting,
                        passing: row.passing,
                        dribbling: row.dribbling,
                        defending: row.defending,
                        physical: row.physic,
                        gkDiving: row.goalkeeping_diving,
                        gkHandling: row.goalkeeping_handling,
                        gkKicking: row.goalkeeping_kicking,
                        gkReflex: row.goalkeeping_reflexes,
                        gkSpeed: row.goalkeeping_speed,
                        gkPos: row.goalkeeping_positioning,
                        LS: row.ls, ST: row.st, RS: row.rs,
                        LW: row.lw, RW: row.rw, LAM: row.lam, CAM: row.cam, RAM: row.ram,
                        LM: row.lm, LCM: row.lcm, RCM: row.rcm, RM: row.rm, CM: row.cm,
                        LB: row.lb, LWB: row.lwb,
                        LDM: row.ldm, CDM: row.cdm, RDM: row.rdm,
                        RB: row.rb, RWB: row.rwb,
                        LCB: row.lcb, CB: row.cb, RCB: row.rcb,
                        GK: row.gk
                    };
                    
                    //Adds flag if it doesn't exist
                    if (!player.flag) {
                        const country = player.nationality;
                        const countryData = flags.find(item => item.nationality === country);
                        if (countryData) {
                           player.flag = countryData.flag;
                        }
                    }
                    //Adds logo if it doesn't exist
                    if (!player.clubLogo) {
                        const club = player.club;
                        const clubData = logos.find(item => item.club === club);
                        if (clubData) {
                            player.clubLogo = clubData.logo;
                        }
                    }

                    return player;
                });
                setPlayerData(playerStuff);
            } //complete
        }); //papa

    }, [flags, logos]); //useEffect

    const handleSearch = () => {
        const normalizedSearchTerm = unaccent(searchTerm.toLowerCase()).replace(/\s+/g, '');

        // Filter player data based on the search term
        const filteredPlayers = playerData.filter(player => {
            if (player  && (player.fullName || player.name)) {
                const fullNameNormalized = player.fullName ? unaccent(player.fullName.toLowerCase().replace(/\s+/g, '')) : '';
                const nameNormalized = player.name ? unaccent(player.name.toLowerCase().replace(/\s+/g, '')) : '';
                return fullNameNormalized.includes(normalizedSearchTerm) || nameNormalized.includes(normalizedSearchTerm);
            }
            return false;
        });
        setNumPages(Math.ceil(filteredPlayers.length / playersPerPage));
        setFiltered(filteredPlayers);
        setNumResults(filteredPlayers.length);
        updateCurrentPlayers(filteredPlayers, 1);
    };

    const updateCurrentPlayers = (filteredPlayers, page) => {
        const startIndex = (page - 1) * playersPerPage;
        const selectedPlayers = filteredPlayers.slice(startIndex, startIndex + playersPerPage);
        console.log("Player names array:", selectedPlayers); // Log player names array
        onSearch(selectedPlayers);
    }

    const handleChangePage = (newPage) => {
        updateCurrentPlayers(filtered, newPage);
    }

    const handleChange = (e) => {
        const value = e.target.value || ''; // If event.target.value is undefined or null, use an empty string
        setSearchTerm(value);
    };

    return (
        <div>
            <input
                type="text"
                className="search-input"
                placeholder="Search for a player"
                value={searchTerm}
                onChange={handleChange}
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        handleSearch();
                    }
                }}
            />
            <button onClick={handleSearch} className="search-button">Search</button>

            {numResults > 0 && (
                <div>
                    <p>{numResults} results found</p>
                    <div>
                        {Array.from({ length: numPages }, (_, i) => (
                            <button key={i} onClick={() => handleChangePage(i + 1)}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>

    );
};

export default SearchBar;