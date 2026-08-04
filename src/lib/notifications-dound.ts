const audio = new Audio(
  "/sounds/notification.mp3"
);

export function playNotificationSound() {

  audio.currentTime = 0;

  audio.play()
    .catch(error => {
      console.log(
        "Navegador bloqueou áudio:",
        error
      );
    });

}