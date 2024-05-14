window.onload = function () {
    // Mendapatkan tombol back-to-top
    var backToTopButton = document.querySelector('.back-to-top');

    // Memeriksa saat scroll
    window.onscroll = function () {
        // Jika jarak scroll sudah lebih dari 20px, tombol akan muncul, jika tidak, tombol akan disembunyikan.
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            backToTopButton.style.display = "block";
        } else {
            backToTopButton.style.display = "none";
        }
    };

    // Fungsi untuk kembali ke atas saat tombol diklik
    backToTopButton.onclick = function () {
        // Menggulir ke atas dengan efek smooth
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
};