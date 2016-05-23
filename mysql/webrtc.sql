-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 23, 2016 at 10:59 PM
-- Server version: 10.1.10-MariaDB
-- PHP Version: 7.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webrtc`
--

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `friendid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`id`, `userid`, `friendid`) VALUES
(1, 1, 2),
(2, 2, 1),
(3, 1, 3),
(4, 3, 1),
(5, 3, 4),
(6, 4, 3);

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE `history` (
  `id` int(11) NOT NULL,
  `firstuser` varchar(40) NOT NULL,
  `seconduser` varchar(40) NOT NULL,
  `message` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `firstuser`, `seconduser`, `message`) VALUES
(1, 'andrea', 'bene', 'heeeey darling'),
(2, 'bene', 'andrea', 'heyz'),
(3, 'szabi', 'bene', 'gfd'),
(4, 'bene', 'szabi', 'gfd'),
(5, 'szabi', 'bene', 'fds'),
(6, 'bene', 'szabi', 'fds'),
(7, 'szabi', 'bene', 'sdf'),
(8, 'bene', 'szabi', 'aaasdf'),
(9, 'szabi', 'bene', 'hjk'),
(10, 'bene', 'szabi', 'hbhj'),
(11, 'szabi', 'bene', 'tre'),
(12, 'bene', 'szabi', 'fffw'),
(13, 'szabi', 'bene', 'gfdg'),
(14, 'szabi', 'bene', 'gfds'),
(15, 'bene', 'szabi', 'cds'),
(16, 'szabi', 'bene', 'zxcvxcv'),
(17, 'bene', 'szabi', ''),
(18, 'szabi', 'bene', 'gdf'),
(19, 'szabi', 'bene', 'dgf'),
(20, 'bene', 'szabi', 'fgdf'),
(21, 'szabi', 'bene', 'gds'),
(22, 'bene', 'szabi', 'gfds'),
(23, 'szabi', 'bene', 'fdas'),
(24, 'bene', 'szabi', 'dfaasa'),
(25, 'szabi', 'bene', 'sasdf'),
(26, 'bene', 'szabi', 'fdsa'),
(27, 'szabi', 'bene', 'fds'),
(28, 'bene', 'szabi', 'gfs'),
(29, 'szabi', 'bene', 'tds'),
(30, 'bene', 'szabi', 'gs'),
(31, 'szabi', 'bene', 'gfsg'),
(32, 'bene', 'szabi', 'gfds'),
(33, 'szabi', 'bene', 'tret'),
(34, 'bene', 'szabi', 'rewt'),
(35, 'szabi', 'bene', 'fesg');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(11) NOT NULL,
  `offererid` int(11) NOT NULL,
  `answererid` int(11) NOT NULL,
  `offerersdp` text NOT NULL,
  `answerersdp` text NOT NULL,
  `candidate` text NOT NULL,
  `status` varchar(40) NOT NULL,
  `updatedtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `mail` varchar(100) NOT NULL,
  `isonline` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `mail`, `isonline`) VALUES
(1, 'bene', '1234', 'mbsz3@yahoo.com', 0),
(2, 'szabi', '1234', 'mbsz2@yahoo.com', 0),
(3, 'andrea', '1234', 'a.a.solomon@yahoo.com', 0),
(4, 'leut puternic', 'leut', 'leut_puternic@yahoo.com', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `history`
--
ALTER TABLE `history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=410;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
