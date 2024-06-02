import React, { useState, useEffect, useRef } from 'react';
import { IoIosSwap } from 'react-icons/io';
import { FaArrowRight } from 'react-icons/fa6';
import { FiDownload } from 'react-icons/fi';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { FaChevronDown } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { FaAngleDown } from 'react-icons/fa6';
import './App.css';

const CollegeTable = () => {
  const [colleges, setColleges] = useState([]);
  const [sortConfig, setSortConfig] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    if (!hasMore || loading) return;

    setLoading(true);
    fetch('/colleges.json')
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setColleges((prevData) => [...prevData, ...data]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading && hasMore) {
      fetchData();
    }
  };

  const renderLoader = (index) => {
    if ((index + 1) % 10 === 0) {
      return <div>Loading...</div>;
    }
    return null;
  };

  const sortedColleges = React.useMemo(() => {
    let sortableColleges = [...colleges];
    if (sortConfig !== null) {
      sortableColleges.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableColleges;
  }, [colleges, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getArrow = (key) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? '↑' : '↓';
  };
  const filteredColleges = sortedColleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSortByCdRank = () => {
    requestSort('cdrank');
  };

  const handleSortByFees = () => {
    requestSort('fees');
  };

  const handleSortByUserRating = () => {
    requestSort('userRating');
  };

  return (
    <div className="container" onScroll={handleScroll}>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          placeholder="Search by college name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input"
        />
        <label>
          <input type="checkbox" onClick={handleSortByCdRank} />
          Sort by Cd Rank
        </label>
        <label>
          <input type="checkbox" onClick={handleSortByFees} />
          Sort by Fees
        </label>
        <label>
          <input type="checkbox" onClick={handleSortByUserRating} />
          Sort by User Review Rating
        </label>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => requestSort('cdrank')}>
              Cd rank {getArrow('cdrank')}
            </th>
            <th onClick={() => requestSort('name')}>
              College Name {getArrow('name')}
            </th>
            <th onClick={() => requestSort('fees')}>
              Course Fees {getArrow('fees')}
            </th>
            <th>Placement</th>

            <th onClick={() => requestSort('userRating')}>
              User Review Rating {getArrow('userRating')}
            </th>
            <th>Ranking {getArrow('Ranking')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredColleges?.map((college, index) => (
            <React.Fragment key={index}>
              <tr className={college.featured ? 'featured-row' : ''}>
                <td>
                  <span className="cdrank">#{college.cdrank}</span>
                </td>

                <td>
                  <div className="college_name_container">
                    {college.featured && (
                      <div className="featured-tag">Featured</div>
                    )}
                    <div>
                      <img src={college.clgImg} alt="img" className="img" />
                    </div>

                    <div className="clg_title_container">
                      <h3 id="clgtitle">{college.name}</h3>
                      <span id="clg_location">{college?.location}</span>
                    </div>
                  </div>
                  <div className="degree_title_container">
                    <span className="degree_title">
                      B.Tech Computer Science Engineering
                    </span>
                    <p className="para">JEE-Advanced 2023 Cutoff -28</p>
                  </div>
                  <div className="link_container">
                    <a>
                      <FaArrowRight /> Apply now
                    </a>
                    <a style={{ color: 'rgb(62, 174, 141)' }}>
                      <FiDownload /> Download Brochure
                    </a>

                    <a style={{ color: '#1c1c1c' }}>
                      <MdCheckBoxOutlineBlank /> Add to Compare
                    </a>
                  </div>
                </td>
                <td>
                  <h4
                    style={{
                      color: 'rgb(62, 174, 141)',
                      fontSize: '16px',
                      fontWeight: '700',
                      margin: '0',
                    }}
                  >
                    ₹{college.fees}
                  </h4>
                  <span style={{ color: '#666666', fontSize: '11px' }}>
                    MCA
                  </span>
                  <p style={{ color: '#666666', fontSize: '11px' }}>
                    -First Year Fees
                  </p>
                  <a style={{ color: '#ff7900', fontSize: '12px' }}>
                    <IoIosSwap />
                    Compare Fees
                  </a>
                </td>
                <td>
                  <h4 className="pkg_container">
                    ₹{college.placement?.avgPkg}
                  </h4>
                  <span className="pkg">Average Package</span>
                  <h4 className="pkg_container">
                    ₹{college.placement?.highestPkg}
                  </h4>
                  <span className="pkg">Highest Package</span>
                  <div style={{ color: '#ff7900', fontSize: '12px' }}>
                    <IoIosSwap />
                    Compare Placement
                  </div>
                </td>

                <td>
                  <div className="user_review_container">
                    <div className="box"></div>
                    <span style={{ fontSize: '1rem', color: '#666666' }}>
                      {college.userRating}/5
                    </span>
                  </div>
                  <span className="reviews">Based on 10 User Reviews</span>
                  <div className="btn">
                    <FaCheck /> Best in Infrastructure <FaAngleDown />
                  </div>
                </td>
                <td>
                  <div style={{ color: '#666666' }}>
                    <span> #{college.rating[0]}/</span>
                    <span style={{ color: '#ff7900' }}>
                      {college.rating[1]}
                    </span>
                    <span> in India</span>
                    <p
                      style={{
                        margin: '0',
                        fontSize: '8px',
                      }}
                    >
                      India
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <h4
                        style={{
                          margin: '0',

                          fontSize: '12px',
                        }}
                      >
                        Today
                      </h4>
                      <span>2023</span>
                    </div>

                    <span className="ranking_btn">
                      +5 more <FaChevronDown id="chevron" />
                    </span>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          ))}
          {loading && renderLoader()}
        </tbody>
      </table>
    </div>
  );
};

export default CollegeTable;
