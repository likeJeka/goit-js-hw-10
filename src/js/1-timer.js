import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  inputEl: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  timerElements: document.querySelector('.timer'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let intervalId;

refs.startButton.disabled = true;

function updateStartButtonAvailability(selectedDate) {
  if (!selectedDate || selectedDate < new Date()) {
    refs.startButton.disabled = true;
  } else {
    refs.startButton.disabled = false;
  }
}

refs.startButton.addEventListener('click', startCountdown);

function startCountdown() {
  const selectedDate = new Date(refs.inputEl.value);
  if (!selectedDate || selectedDate < new Date()) {
    alert('Please select a valid future date.');
    return;
  }

  clearInterval(intervalId);

  intervalId = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = selectedDate - currentTime;

    if (timeDifference <= 0) {
      clearInterval(intervalId);
      updateTimer(0, 0, 0, 0);
      iziToast.show({
        message: 'Finished',
        color: 'green',
      });
      refs.startButton.disabled = true;
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);
    updateTimer(days, hours, minutes, seconds);
  }, 1000);

  refs.startButton.disabled = true;
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);

  const hours = Math.floor((ms % day) / hour);

  const minutes = Math.floor(((ms % day) % hour) / minute);

  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateTimer(days, hours, minutes, seconds) {
  refs.days.textContent = String(days).padStart(2, '0');
  refs.hours.textContent = String(hours).padStart(2, '0');
  refs.minutes.textContent = String(minutes).padStart(2, '0');
  refs.seconds.textContent = String(seconds).padStart(2, '0');
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    updateStartButtonAvailability(selectedDate);
    if (selectedDate && selectedDate < new Date()) {
      iziToast.show({
        message: 'Please choose a day for a future :)',
        color: 'red',
      });
    }
  },
};
flatpickr('#datetime-picker', options);
