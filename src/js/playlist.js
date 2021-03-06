import $ from 'jquery';
import '../scss/playlist.scss';
import createSong from './createSong';
import loading from './loading';

function createTag(tag) {
  return `<div class="list-tag borders">${tag}</div>`;
}

function createP(e) {
  return `<span>${e}<br></span>`;
}
$(() => {
  const url = '/api';
  const playlistDetail = `${url}/playlist/detail?id=`;
  let playlistId = '';
  const $bg = $('.list-header-bg');
  const $name = $('.list-title');
  const $playCount = $('.playlist-num>p');
  const $cover = $('.playlist-cover>img');
  const $usrName = $('.list-author>p');
  const $usrAvatar = $('.u-avatar');
  const $tags = $('.list-tags');
  const $des = $('.description');
  const $songs = $('.list-songs');
  let bgPic = '';

  playlistId = window.location.search.match(/\bid=([^&]*)/)[1];

  $.getJSON(playlistDetail + playlistId, (propData) => {
    const data = propData.playlist;
    $('title').text(data.name);
    $name.text(data.name);
    $usrName.text(data.creator.nickname);

    // play count
    data.playCount = Math.floor(data.playCount);
    if (data.playCount / 10000 > 30) {
      data.playCount = `${Math.floor(data.playCount / 10000)} 万`;
    }
    $playCount.text(data.playCount);
    // info
    data.tags.forEach((tag) => {
      $tags.append(createTag(tag));
    });
    data.description = `简介：${data.description}`;
    data.description.split('\n').forEach((e) => {
      $des.append(createP(e));
    });

    // pic
    bgPic += `//music.163.com/api/img/blur/${(data.coverImgId_str ? data.coverImgId_str : data.coverImgId).toString()}.jpg?imageView&thumbnail=40x0&quality=75&tostatic=0`;
    data.creator.avatarUrl = data.creator.avatarUrl.replace(/https?:\/\//, '//');
    data.coverImgUrl = data.coverImgUrl.replace(/https:\/\//, '//');

    // check chrome
    if (!!window.chrome && !!window.chrome.webstore) {
      data.creator.avatarUrl = data.creator.avatarUrl.replace('.jpg', '.webp?imageView&thumbnail=60x0&quality=75&tostatic=0&type=webp');
      data.coverImgUrl = data.coverImgUrl.replace('.jpg', '.webp?imageView&thumbnail=252x0&quality=75&tostatic=0&type=webp');
    } else {
      data.creator.avatarUrl += '?imageView&thumbnail=60x0&quality=75&tostatic=0';
      data.coverImgUrl += '?imageView&thumbnail=252x0&quality=75&tostatic=0';
    }
    $bg.css('background-image', `url(${bgPic})`);
    $usrAvatar[0].src = data.creator.avatarUrl;
    $cover[0].src = data.coverImgUrl;

    data.tracks.forEach((song, index) => {
      $songs.append(createSong(song, index + 1));
    });
  }).done(loading('loading-playlist'));
  $('.list-intro-arrows').on('click', (e) => {
    $('.icon-more').toggleClass('active');
    $('.icon-less').toggleClass('active');
    $('.description').toggleClass('active');
  });
});
