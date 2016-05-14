-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2016 at 03:38 PM
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
  `userid` int(11) NOT NULL,
  `friendid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`userid`, `friendid`) VALUES
(1, 2),
(2, 1),
(1, 3),
(3, 1);

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

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `offererid`, `answererid`, `offerersdp`, `answerersdp`, `candidate`, `status`, `updatedtime`) VALUES
(160, 1, 2, 'v=0\r\no=- 8542613498188957686 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:XfohMH0QajkFFeZn\r\na=ice-pwd:a41HYwbD8ISclS+jy9ee347d\r\na=fingerprint:sha-256 C4:44:74:C5:79:BC:AA:A2:0A:14:9B:23:BE:09:6F:33:21:96:D5:44:7C:1A:9B:81:CB:1C:AF:1E:27:BA:09:D1\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 4983053681831555904 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:5LSxjlawLY94i/rg\r\na=ice-pwd:GfHqTkMfdw8gBIFKNZvyQsBA\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:4019395398 1 tcp 1518280447 192.168.1.103 9 typ host tcptype active generation 0 ufrag XfohMH0QajkFFeZn', 'complete', '2016-05-09 15:13:39'),
(161, 1, 2, 'v=0\r\no=- 1978660332135415 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:1S6lzEFI4LRGrYMK\r\na=ice-pwd:m3yCY+t+dxfsGS6vGj8Qearn\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 7049965189760249925 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:09vVfE+W0yiz0knt\r\na=ice-pwd:HCUWJD5tF629kwjI3p7XBN5R\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 58609 typ host generation 0 ufrag 1S6lzEFI4LRGrYMK', 'complete', '2016-05-09 15:14:04'),
(162, 1, 2, 'v=0\r\no=- 3179393917417494638 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:D0yeSDfg4L0+hETg\r\na=ice-pwd:4uqjQqvCAvMccfN/hqbWuOlk\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 1306887432781730042 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:24gq80V+uVgaXz8a\r\na=ice-pwd:KnkcGhdD/idVvWuzoyk/NI1q\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 54767 typ host generation 0 ufrag D0yeSDfg4L0+hETg', 'complete', '2016-05-09 16:25:06'),
(163, 1, 2, 'v=0\r\no=- 5018963978983189522 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:ZipD2PUcMHLZzc4M\r\na=ice-pwd:SuQvxqXCPoUcR0jxVnm5XTmY\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 662672196908116064 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:3H3KQvbJkAFt1Vjj\r\na=ice-pwd:A7uptbIyWykqzm3mFKt45/6A\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 51119 typ host generation 0 ufrag ZipD2PUcMHLZzc4M', 'complete', '2016-05-09 16:57:13'),
(164, 1, 2, 'v=0\r\no=- 4368896301056431429 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:ZZT1+f/Qz5hAkHbX\r\na=ice-pwd:+HBojui+jJDwdOLtDVQ79UO/\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 2419603117448053319 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:e/C0JYNsIXLsptML\r\na=ice-pwd:Vu8pIHAMDU7Xs+v0E7hF2v0f\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 60590 typ host generation 0 ufrag ZZT1+f/Qz5hAkHbX', 'complete', '2016-05-09 17:04:20'),
(165, 1, 2, 'v=0\r\no=- 6171671328204679490 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:tYadJg6ZI0lmC/tO\r\na=ice-pwd:ixUAjhgmqvu1POiFcyp0r8+4\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 1459386496117401714 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:F/lELO/3wT5ihNPC\r\na=ice-pwd:yNLKWDrZQELRJv25BfrIQiMJ\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 57885 typ host generation 0 ufrag tYadJg6ZI0lmC/tO', 'complete', '2016-05-09 17:05:44'),
(166, 1, 2, 'v=0\r\no=- 5572689138201850783 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:ue0iDtBsRZmPfCj+\r\na=ice-pwd:rF5JLE9kZSZSjKQf8AKUa+1s\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 639722016016546384 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:HmgWvoHcuOIqRaIY\r\na=ice-pwd:F1w2V4ldpDizW9tlhNUn364e\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 52028 typ host generation 0 ufrag ue0iDtBsRZmPfCj+', 'complete', '2016-05-09 17:12:21'),
(167, 1, 2, 'v=0\r\no=- 5909219708943910081 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:N5S/SefpZEQYFAC7\r\na=ice-pwd:WzkxLYBdWpxti0QrhY8vk7Tq\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 361967799190034844 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:P3+K5qicd4g9HXOM\r\na=ice-pwd:FXTy57KL8eTVpZa69dGzGyJa\r\na=fingerprint:sha-256 35:52:C0:D4:84:99:32:D4:81:F1:00:8A:AD:D8:8D:6F:73:28:9C:92:4B:5D:93:65:AC:7E:DB:4A:51:25:3C:7D\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 52642 typ host generation 0 ufrag N5S/SefpZEQYFAC7', 'complete', '2016-05-09 17:26:58'),
(168, 1, 2, 'v=0\r\no=- 6447599574628675122 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:VCpsbn2RN1ibQCzw\r\na=ice-pwd:/LYnGun1wqcHmvaIMibjUnrI\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 4410278944591929420 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:T+Aioewm0q1MXT6Y\r\na=ice-pwd:qCgHCLf0a1S5RD09RAES/eIT\r\na=fingerprint:sha-256 61:20:5C:09:E1:F2:00:D4:23:D1:83:A6:E6:E6:96:18:3F:C3:1D:3B:53:08:6D:90:89:18:73:A1:4D:0C:93:B5\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 58556 typ host generation 0 ufrag VCpsbn2RN1ibQCzw', 'complete', '2016-05-10 14:36:25'),
(169, 1, 2, 'v=0\r\no=- 5661579485255454679 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:J8nzNP5vrLOE2/Sj\r\na=ice-pwd:wEXevad2fS4WoNwoVwh9hCyR\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 879643010993047900 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:BVhivWr2GpdpJiy8\r\na=ice-pwd:XYkpMFu1jL43F7BhyLmZq45M\r\na=fingerprint:sha-256 61:20:5C:09:E1:F2:00:D4:23:D1:83:A6:E6:E6:96:18:3F:C3:1D:3B:53:08:6D:90:89:18:73:A1:4D:0C:93:B5\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 53145 typ host generation 0 ufrag J8nzNP5vrLOE2/Sj', 'complete', '2016-05-10 14:39:42'),
(170, 1, 2, 'v=0\r\no=- 7036931536094601405 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:Cwmq9L98YPnYwU9U\r\na=ice-pwd:kxsAT9f6epvwQfEXyPLt2/MP\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 5974689205864542858 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:UvcHpPkJbtGrOik/\r\na=ice-pwd:WGexDlsgFull8T8FREoIvs6F\r\na=fingerprint:sha-256 61:20:5C:09:E1:F2:00:D4:23:D1:83:A6:E6:E6:96:18:3F:C3:1D:3B:53:08:6D:90:89:18:73:A1:4D:0C:93:B5\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 54928 typ host generation 0 ufrag Cwmq9L98YPnYwU9U', 'complete', '2016-05-10 14:40:24'),
(171, 1, 2, 'v=0\r\no=- 4574804786814026373 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:cGEC/Lxith0JaNZR\r\na=ice-pwd:uDl4Z+jAiYhgN2Gsr1PgtXxN\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 6356470907291496897 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:m4fixidLth13xK0g\r\na=ice-pwd:RsG7JnDboMndQoAbnIlgvqSu\r\na=fingerprint:sha-256 61:20:5C:09:E1:F2:00:D4:23:D1:83:A6:E6:E6:96:18:3F:C3:1D:3B:53:08:6D:90:89:18:73:A1:4D:0C:93:B5\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 54941 typ host generation 0 ufrag cGEC/Lxith0JaNZR', 'complete', '2016-05-10 14:41:13'),
(172, 1, 3, 'v=0\r\no=- 5986558590660999367 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:ZM/IELwEQ0CStO8c\r\na=ice-pwd:TPk9/BQHrU1CMss4IMfUVy3m\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 4791444704207773025 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:zXfYXZs2eSr3mQH2\r\na=ice-pwd:N436MPn9FvhkbwHAXkKy1MY/\r\na=fingerprint:sha-256 C6:5E:DA:73:EC:96:86:2C:E9:29:1D:E1:DD:8B:2F:C1:95:EC:CF:B0:02:73:8D:C5:1D:5F:2E:86:FB:36:AF:78\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 64141 typ host generation 0 ufrag ZM/IELwEQ0CStO8c', 'complete', '2016-05-14 13:20:21'),
(173, 1, 3, 'v=0\r\no=- 8096231855945913719 3 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\na=ice-ufrag:XesBTNg2a6Ecd90e\r\na=ice-pwd:SHBl/j+mGX3IrSqkHA4qhqPu\r\na=fingerprint:sha-256 C4:3A:F7:0D:1B:3E:46:E4:F9:25:7D:54:31:7F:05:77:D8:55:91:92:E6:7E:17:15:4D:1B:4B:FF:84:FA:AD:0B\r\na=setup:actpass\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'v=0\r\no=- 861281069424694785 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\na=msid-semantic: WMS\r\nm=application 9 DTLS/SCTP 5000\r\nc=IN IP4 0.0.0.0\r\nb=AS:30\r\na=ice-ufrag:L5qWpgwcUDmPn9yG\r\na=ice-pwd:IXvjAp8eWCoRyhtT2qiZD+3G\r\na=fingerprint:sha-256 C6:5E:DA:73:EC:96:86:2C:E9:29:1D:E1:DD:8B:2F:C1:95:EC:CF:B0:02:73:8D:C5:1D:5F:2E:86:FB:36:AF:78\r\na=setup:active\r\na=mid:data\r\na=sctpmap:5000 webrtc-datachannel 1024\r\n', 'candidate:2702239670 1 udp 2113937151 192.168.1.103 51238 typ host generation 0 ufrag XesBTNg2a6Ecd90e', 'complete', '2016-05-14 13:23:02');

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
-- AUTO_INCREMENT for table `history`
--
ALTER TABLE `history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
