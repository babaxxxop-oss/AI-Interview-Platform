/* Progressive enhancement for the Flask interview form. Browser media stays alive
   for the page lifetime; the server remains the authority for question progression. */
(() => {
  const $ = (s) => document.querySelector(s);
  const answer = $('#answer'), mic = $('#micBtn'), question = $('#aiQuestion');
  const status = $('#voiceStatus'), helper = $('#voiceHelper'), novaStatus = $('#novaStatus');
  const timer = $('#timer'), sideTimer = $('#sideTimer'), bars = [...document.querySelectorAll('#waveform i')];
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition, isListening = false, finalText = '', micStream, cameraStream, audioContext, analyser, frame;
  let speechPaused = false, muted = localStorage.getItem('aimockMuted') === 'true', seconds = 600, activeSeconds = 0;

  const setText = (el, value) => { if (el) el.textContent = value; };
  const formatTime = () => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const updateCounts = () => {
    const words = answer.value.trim() ? answer.value.trim().split(/\s+/).length : 0;
    $('#wordCount').textContent = `${words} word${words === 1 ? '' : 's'}`;
    $('#characterCount').textContent = `${answer.value.length} chars`;
    const wpm = activeSeconds ? Math.round(words / (activeSeconds / 60)) : 0;
    $('#speakingTime').textContent = `${activeSeconds} sec · ${wpm} WPM · English`;
  };
  const setListening = (on) => {
    isListening = on; document.body.classList.toggle('is-recording', on);
    mic.setAttribute('aria-label', on ? 'Stop microphone' : 'Start microphone');
    setText(status, on ? 'Listening…' : 'Tap to start speaking');
    setText(helper, on ? 'Your microphone stays on for this question' : 'Your microphone is off');
    setText(novaStatus, on ? 'Listening carefully' : 'Ready when you are');
    $('#recordingBadge').innerHTML = `<i></i> ${on ? 'Listening' : 'Ready'}`;
  };
  const drawWave = () => {
    if (!isListening || !analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(data);
    bars.forEach((bar, i) => bar.style.height = `${Math.max(5, Math.min(31, 5 + (data[i * 3] || 0) / 7))}px`);
    frame = requestAnimationFrame(drawWave);
  };
  const ensureMic = async () => {
    if (micStream?.active) return micStream;
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)(); analyser = audioContext.createAnalyser(); analyser.fftSize = 64;
    audioContext.createMediaStreamSource(micStream).connect(analyser); return micStream;
  };
  const startListening = async () => {
    if (!SpeechRecognition) { setText(status, 'Speech recognition unavailable'); setText(helper, 'You can still type your response'); return; }
    try { await ensureMic(); finalText = answer.value.trim() ? `${answer.value.trim()} ` : ''; recognition.start(); setListening(true); drawWave(); }
    catch (_) { setText(status, 'Microphone permission needed'); setText(helper, 'Allow access, then try again'); }
  };
  const stopListening = () => { if (!isListening) return; recognition.stop(); cancelAnimationFrame(frame); bars.forEach(b => b.style.height = '7px'); setListening(false); };
  if (SpeechRecognition) {
    recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = localStorage.getItem('aimockLanguage') || 'en-US';
    recognition.onresult = (event) => { let interim = ''; for (let i = event.resultIndex; i < event.results.length; i++) { const value = event.results[i][0].transcript; event.results[i].isFinal ? finalText += `${value} ` : interim += value; } answer.value = `${finalText}${interim}`.replace(/\s+/g, ' ').trimStart(); updateCounts(); };
    recognition.onerror = (event) => { if (event.error !== 'no-speech') { stopListening(); setText(helper, 'Keep typing or retry the microphone'); } };
    recognition.onend = () => { if (isListening) try { recognition.start(); } catch (_) {} };
  }
  mic.addEventListener('click', () => isListening ? stopListening() : startListening()); answer.addEventListener('input', updateCounts); updateCounts();

  const speed = $('#voiceSpeed'); speed.value = localStorage.getItem('aimockVoiceSpeed') || '1';
  speed.addEventListener('input', () => { localStorage.setItem('aimockVoiceSpeed', speed.value); $('#listenBtn').click(); });
  const speak = () => {
    if (muted || !window.speechSynthesis) return;
    speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(question.textContent.trim()); utterance.rate = Number(speed.value); utterance.lang = recognition?.lang || 'en-US';
    utterance.onstart = () => { setText(novaStatus, 'Speaking'); $('#avatarWrap').setAttribute('aria-label', 'Nova AI, speaking'); $('#pauseVoiceBtn').disabled = false; };
    utterance.onend = () => { setText(novaStatus, isListening ? 'Listening carefully' : 'Ready when you are'); $('#pauseVoiceBtn').disabled = true; speechPaused = false; };
    speechSynthesis.speak(utterance);
  };
  $('#listenBtn').addEventListener('click', speak);
  $('#pauseVoiceBtn').addEventListener('click', () => { speechPaused = !speechPaused; speechPaused ? speechSynthesis.pause() : speechSynthesis.resume(); $('#pauseVoiceBtn').setAttribute('aria-label', speechPaused ? 'Resume Nova' : 'Pause Nova'); });
  $('#muteBtn').addEventListener('click', (e) => { muted = !muted; localStorage.setItem('aimockMuted', muted); speechSynthesis.cancel(); e.currentTarget.classList.toggle('is-muted', muted); e.currentTarget.setAttribute('aria-label', muted ? 'Unmute Nova' : 'Mute Nova'); });
  // Speech starts immediately where browser policy permits; the first interaction is a graceful fallback.
  window.setTimeout(speak, 260); window.addEventListener('pointerdown', speak, { once: true });

  $('#themeToggle').addEventListener('click', () => { const dark = !document.documentElement.classList.contains('dark'); document.documentElement.classList.toggle('dark', dark); localStorage.setItem('theme', dark ? 'dark' : 'light'); });
  $('#fullscreenBtn').addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen());
  $('#cameraBtn').addEventListener('click', async () => {
    const video = $('#cameraFeed'); try { cameraStream ||= await navigator.mediaDevices.getUserMedia({ video: true, audio: false }); video.srcObject = cameraStream; video.style.display = 'block'; $('.camera-empty').style.display = 'none'; $('#cameraPreview').classList.add('is-active'); setText($('#cameraBtn'), 'Camera on'); setText($('#cameraNote'), 'Camera preview is local. Presence analysis is ready for a future vision model.'); } catch (_) { setText($('#cameraNote'), 'Camera permission was not granted. You can enable it later.'); }
  });
  const tick = () => { if (!speechSynthesis.speaking && seconds > 0) { seconds -= 1; if (isListening) activeSeconds += 1; } timer.textContent = sideTimer.textContent = formatTime(); timer.classList.toggle('is-warning', seconds <= 120 && seconds > 30); timer.classList.toggle('is-critical', seconds <= 30); updateCounts(); };
  setInterval(tick, 1000); timer.textContent = sideTimer.textContent = formatTime();
  $('#answerForm').addEventListener('submit', () => { stopListening(); document.body.classList.add('is-thinking'); setText($('#analysisState'), 'Analyzing your response…'); });
  document.addEventListener('keydown', (e) => { if (e.target === answer && e.key !== 'Escape') return; if (e.code === 'Space') { e.preventDefault(); isListening ? stopListening() : startListening(); } if (e.key.toLowerCase() === 'f') $('#fullscreenBtn').click(); if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen(); if (e.key === 'Enter' && !e.shiftKey && answer.value.trim()) $('#answerForm').requestSubmit(); });
  window.addEventListener('offline', () => setText($('.network-status span'), 'Offline')); window.addEventListener('online', () => setText($('.network-status span'), 'Online'));
  window.addEventListener('beforeunload', () => { micStream?.getTracks().forEach(t => t.stop()); cameraStream?.getTracks().forEach(t => t.stop()); });
})();
