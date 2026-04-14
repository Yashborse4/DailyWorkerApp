import Sound from 'react-native-sound';

// Enable playback in silence mode (necessary for iOS)
Sound.setCategory('Playback');

/**
 * Service to handle native sound effects and ringtones.
 * 
 * NOTE: For this to work, a 'ringtone.mp3' file must be added to:
 * - Android: android/app/src/main/res/raw/ringtone.mp3
 * - iOS: Add to project in Xcode (main bundle)
 */
class SoundService {
  private ringtone: Sound | null = null;

  /**
   * Plays the incoming call ringtone in a loop.
   */
  playRingtone() {
    if (this.ringtone) {
      console.log('Ringtone already playing');
      return;
    }

    // Try to load 'ringtone.mp3' from the main bundle
    this.ringtone = new Sound('ringtone.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.warn('Ringtone file not found or failed to load. Please add ringtone.mp3 to your native resources.', error);
        return;
      }
      
      // Set infinite loop
      this.ringtone?.setNumberOfLoops(-1);
      this.ringtone?.setVolume(1.0);
      
      this.ringtone?.play((success) => {
        if (!success) {
          console.error('Playback failed due to audio decoding errors');
        }
      });
    });
  }

  /**
   * Stops the ringtone and releases resources.
   */
  stopRingtone() {
    if (this.ringtone) {
      this.ringtone.stop(() => {
        this.ringtone?.release();
        this.ringtone = null;
        console.log('Ringtone stopped and released');
      });
    }
  }
}

export default new SoundService();
