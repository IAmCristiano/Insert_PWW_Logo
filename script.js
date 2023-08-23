document.addEventListener("DOMContentLoaded", () => {
  const toggleModeButton = document.getElementById("toggleModeButton");
  const imageInput = document.getElementById("imageInput");
  const positionButtons = document.querySelectorAll(".topPositionButton, .centerPositionButton, .bottomPositionButton");
  const outputContainer = document.getElementById("outputContainer");
  const outputImage = document.getElementById("outputImage");
  const downloadButton = document.getElementById("downloadButton");

  positionButtons.forEach(button => {
    button.addEventListener("click", function () {
      applyWatermark(button.dataset.position, button.dataset.size);
    });
  });

  toggleModeButton.addEventListener("click", toggleMode);

  downloadButton.addEventListener("click", () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = outputImage.src;
    downloadLink.download = "watermarked_image.png";
    downloadLink.click();
  });

  function toggleMode() {
    document.body.classList.toggle("dark-mode");
  }

  function applyWatermark(position, size) {
    const selectedImage = imageInput.files[0];
    if (selectedImage) {
      const reader = new FileReader();

      reader.onload = function (event) {
        const img = new Image();
        img.src = event.target.result;

        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);

          const logo = new Image();
          logo.src = "logo.png";
          let logoSize, padding;

          switch (size) {
            case "small":
              logoSize = 100;
              padding = 5;
              break;
            case "medium":
              logoSize = 200;
              padding = 10;
              break;
          }

          logo.onload = function () {
            let logoX, logoY;

            switch (position) {
              case "bottom-left":
                logoX = padding;
                logoY = canvas.height - logoSize - padding;
                break;
              case "top-left":
                logoX = padding;
                logoY = padding;
                break;
              case "bottom-right":
                logoX = canvas.width - logoSize - padding;
                logoY = canvas.height - logoSize - padding;
                break;
              case "top-right":
                logoX = canvas.width - logoSize - padding;
                logoY = padding;
                break;
              case "center":
                logoX = (canvas.width - logoSize) / 2;
                logoY = (canvas.height - logoSize) / 2;
                break;
              case "center-left":
                logoX = padding;
                logoY = (canvas.height - logoSize) / 2;
                break;
              case "center-right":
                logoX = canvas.width - logoSize - padding;
                logoY = (canvas.height - logoSize) / 2;
                break;
            }

            context.drawImage(logo, logoX, logoY, logoSize, logoSize);

            outputImage.src = canvas.toDataURL();
            outputContainer.style.display = "block";
            downloadButton.style.display = "block";
          };
        };
      };

      reader.readAsDataURL(selectedImage);
    }
  }
});