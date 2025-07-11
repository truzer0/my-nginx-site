<?php
session_start();
// Предположим, что токен хранится в localStorage, а не в PHP
?>
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8" />
<title>Статьи</title>
<link rel="icon" href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIVFRUQDw8VFRYVFRUQEBUVFRUWFhUVFRUYHSggGBolGxUVIjYhJikrLi4uFx8zODMsNygtLi0BCgoKDg0OFxAQFS0dHR0tLS0rLS0tKy0tLSsrLS0tLSstKy0tLS0tLSstLS0tLS0tKy0tLSstLS0tLS0tLS0tLf/AABEIAKgBKwMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAACAAEDBAUGB//EAD8QAAIBAgMGBAMGBAYBBQEAAAECAAMRBBIhBRMxQVFhBnGBkSIyoRRCUrHB8Adi0eEjJHKCkqLCM0NTs/EV/8QAGQEBAQEBAQEAAAAAAAAAAAAAAAECAwQF/8QAIhEBAQACAgEEAwEAAAAAAAAAAAECERIhAyIxQVEEEzJh/9oADAMBAAIRAxEAPwDzsLJqdGTUqMsfZ7TppmqjUYwpiWXWV30lQ4ERMDPAvCpLQ0gAR0M1EWQt50OxcDvMJigBqu5Yf7M5P0vOfptO5/h6Qd8h1zLTNuoGcH8xKg/4dYEBalYjVmCDyGp+pHtOkr4e9VXP3XW3b4GX86v0g+HcBuEelyWtUI/0sAV+h+kuOgJIv39xlI/6gyfIVGwU9AW+hMakbC55/Ef32GnpI0B3ZUnXVSeHFspP1vAxjXXL+I29Dx+l5ZBZL6DyB95FXf7oPHieg7dzw95GtW+vr+srpV5/it7cvpLMRcDgDoAPQCB9oJNlHv8A0/ZnOptg165o0zZKXzsPvNf5R/KLHzt046WI2jSord3VB3Op/Uma4DYWpbufpBqYsAgcWPADie9uQ7zjm8TPXbd4RfOq4+FfJeZ8/abGzMJkBzMXZvnZtWbz6KOSjQd44DaWtf4uQ4dWPb9Ot/KT0zYXJGguTyHXXoJjY/a1GgM9VrW+VRqxPlzP5flT2dWrYxhVqjd4cG6Uho1S3Bqn8v0/OZ4jqKFTMM1rA/L1I6npfp/+CR2tw4nh/ftIhU9/pHpm3ViRra3sLmY0M/a2xKWKCpWV3RGzZLmmjN1fhm4nS9teEhx/hlKqLQ0pYdCC1GkAm8twV2HBew1JtrNxah/CfUr+hkG0cNUq02pq+6zCxdfiqAc8t9Ae+tukDxfx44xGLZaKjc4CgFOWwRQhOa3LVmCAdROJKz0z+Ii4fBUF2fhwA1RlqVjfNUIX5M7cyTrblbhrPNWkrUR2iJjNAMinitFCEyAIg5ZNaCRKqEiK0MiICQBFDIjZYHW0as0EqgzFRrSwlabRpVVBEzcRDOJ0lao94RAWklMwbSSmkQqdREBJkWS06NzYC5PIamdGUOQj14HkZ03gbF7vEqCdKgKf8vl/7Ae8HZuxMTyw7Mp4q6kKe9zYg9wQZr0/ChOoSrRbjY5aqA9ipDD2M10jtr2YH8Qt6i5/In2kFZstQjtfvY2GnlZfcxUcxQLUIzgDMVvxHBhcDz4SltjP8NWmLvSJ+H8aEfEnnwI/0iZk7VDtjHbkAn5WrUdeQu4zA9OvqZNXf5f9X/i0yNqYini6DUqbXd7ZU/8AczqQwBXiOGp4AG80cHs9kpIcZVAIsMtMkFm1suYfEzW5JbW/GbtmIydgbVD0t0bmrSU02UAs9wCoaw1t3mrVwVZkOgpgqRmY3YXFgVRL38iRNjCYcgZaVNaKk31UZz3yjQE9SSeokDYGg5/xN5X/ANZL0j5U1AQ+eX1mL5L8I4XC7FVc1PDVq1Vr/HkZKSdL3RHdbWOl7iWF8C0S2fEVGBYcFAZtBr8VS7ufJBO2GErt8IK4ekOCoA1Y+Z+Wn/tue8M4fDYYZnIuxHxVGzu55AA8T2UTFytVzuzfDmFp60KNRzyY1HVD57vQH/UolutsOu5un+H1z1alvLIrN7hl8psvtYBc7jdU+T1iKZPQLTPxejZT2MyaniJ6h/ymHrYg62dr0MOPe2b1HkZN0VKfgcB9+7LUqD7rZzTPQ3ZmIPuOwkpx9RH3b0Hpm9lNQqqOeQRkzZj24yxTxWOU5qtGqysNQm6VKZ7U6Zaow75z5azQXENWBSm1Bjl+JKi1MwH89NrMB5iamdgr4d3OpPoBb3LcfS0v0mJ5+2v1P9PWZtbY2KyndVaKG2istSooPOzFrgdiDby0mUdpfYyPttSqajcPg/wSRxNMoAp9TmA4gTe5R2iGU9qLiGpsMOURyNGqXYDvlX9faYGE8d4MmxZ17sht/wBbzaoeJMIwuK6W7nL+dpnjfoeQ+IfBG0VZqtRDXLElnptvWJ7r830nJYnA1E+dGW34lK/nPbtueO8NRBFJatduWUutMebk/kDPJfE+36uMqZ6tgFuFQXsoPHU6k9zJZr3WOdYQcsnZYBWYaR2jiFaCZA94xjXiEoVo1oYjGTQAwYZg2hW9eFeAIxMqCZoBaCxgkygw8sUa9pSvHBgbK4hZo7L281Ak0goYi2YqGYDot+E5cPCWpNSs2O7oeLsUdd7/ANV/pNLC+Nq40dUcdro300+k4DDViJ0mx62GQbyvd2v8NIcBbm5P5e86zVZru8B4jp1tAGU8wRp/yGnvKWMGIOIG4yFHW7ljZaYH3ye+vnblqZhVfFb/AC0kRFHDS5/QfSQUatfEndvUK0mqKajrYEkqcq24HSm1hwBLE9Ys4zcHW7OxaZ3p4JFq1SRv67DJRU92Grc7IvqdS02cPgkpNvajGrWYEBiLv3SknBF4cPNjzmfsbFUlpBMOtqSnKtiQa1TTNZiLlQSLta7E2HQ7FMbvVvjrVb9tBy5hKa3+v3mNzwoauOdU6MbLSX4sx6Hm57cBre9ryd8SEXPUKootxOo6AngT2H1lWvXKtlRd7XK6/dp0wdRnbXIvRRdm76kcht3boo1hSp/5vGm4vlO5oaahVB+D6nT4jwhY0vEHiZ0HEYalwFWsuatUPShQ4k92sNe0w9mbZosS1OulNyPirVT9t2gwPREutIfy6+U5nFbOq1KpxOIc4p1K51Rd5T1YBaZfMEAzG1hpc8p1mxa2LfNSprSR6WXNSDJTemWHwArax01spJ0I7SWZfEX0zq1r7PxOz1beHf1qn/yVcPiqz+S3pWUdgBN6j4gw7aXcf66NekPd0AlPYNSrUVmqbvSoVBplmU24/Mo56aXvbjyGtupx/Zfp1/XPtH//AEVJ/wANqVTsKgV7eWtz7SptHbFFABiadSmL6M6FkB6iohIB73Bl16Km2YAgHUEXBHPQ+/pM7a2zU+VQERSC6pdFYAXysqkKR8t7jhfrNzPrbPDvSGttRhrTpPVTiCWSnVt1psSCR2exPMwsTiExFLK9Pf0XAzqVy16d+DNT+9Y31WxFtLzzzxlj8Uz06yMy0bKaeUkWe9wao/ERlIB7jje+0nijdincWSvTWrTqAnPSdrGqhte4vqdDYtqG4SYZ23syw1OnMeLNkfYqoGfNSrKXpNxYqLXBsOIzDXgbjuBjrtRRpZvOygy1432jv8UzfDZURRkN0OmYkakC5YkgE6k6mYFp6sfJZGFzEGm4uHKno1yP195m1aZBsf7eYkhkZmcrtYjIgMJI0jmFAwgESYiNaBDliAkto0gG0YwzGgRmNJCIOWBrI8MmQiPeAnkZhkwTKBiBjxrQHvHBgxCBco1best0Wmahlui03Kw0UaXtnVXctRVmvVSwVbf4jKQwQ+gf1t1mVnljY+1Dh6yVgL5CbjmVYFWseRsTYibt6TTsh4lXBWTIKr0EWnmvlpqVFmFNQLtrcZr662Gpv0mwPECYgW3iLWqEZytyVFrimgYcVuRc6E3IuTlHIbT8GV6tUjDqWo/Ay1CwF1ZQRYm1+PEXsLc5LsDZJp1XajVVhh7LmABBqvZFCqfmAZ1OY6aDqJxa1HWbXrVCGwmBsrC+9qkkhGYXKhtS1Y3BJN7c9SJy+A8AuqtUdr1eCBWIWx0csSNSQW0/rp3+Dwi01CqLAX7nU3JJOpJJJJOpJvLQSea5216McZiwMPssjCnC5FFxbNqRcHMHI0+IELbXkOEdPDoPxVKjl7nM4yI7ggXU5VFl0tYakAXJnQBY9o55faccd712gwuHVFCKLKosBJ49oplpFUGhHYzP2rUbdM4XM2Vmy9Ta4X9JptOf8WbVGHoM9szaBF4lmZgi6cbZmHCN9aHlmyKq4eruqmV8PVAVtcyMlyEqdiCPMWI4ztDs1KKBMgenvGQBzq1NqQY5WHysHQWP8s5bYXhWvWqg10ZKd8zlrIz8yoHEXPOw0v2ncbZAFCrUAATD0KgTgBvCuXQdFBC/7mHKb8c3nEyvpu3kGLRc75Lld5Uy3+bLmOW/e1pAZK0jYT1vOhcwJIyxKki7QsIIWW93AZJNG0BWRkSdlkZWRUUUkCx8kCK0VpKVgmAForR4rQLsUUaQKMY8aUK0Vo8UqGtGtHvHjRTqZPTqSvDWaiLO9jgyJVk9NJYj0fwRjHxOCfBKzZqTjQEKWoufl3hvlAOa9hfLYCddS2elLd4dAPhAqVCBYaXFNbHUAsWYcf8A0yTckk+U+Eca9HE0ytQoKjbtiLH59FuGBBGfJPU8DiGS/wBoPxs1zUtlpPyXKeCaWGU68fm4nh5rx6dMMd3bYWGJUqVH0CKp6lmK28rA3+ksqZ5nYUUV4ryoUUa8YmCQzzn9qvT+0IKhW27JUMbfEHQi3Uzedp5P/GOhnNDtvh/9cSdq6jxZt0YajdLF3OVByuR8x7Aa+w5ziqW2av2CrSa7IaqAMSSczE1GHf5b+vectRZiFVmZsosMzM9r8lBOg8uk7zbGxjR2WAR8S1KdR+xZgp9gwHpOmF4WM5eqOEeRwjBM9bzmtFHEYwGLQSYiIBMimJgmImCTMkK8WaATBJkaSEwDGvFAVo9ohCgWYxh5YssgCK0MLHySgLRoZEa0qBihZYrSgRJUEACTUxLIixSWWVWQ00lhBOuMSl+9NDPYPC21RicOrm2cDJUH84GunQix9Z5CRNrwpto4WtmN93UstQdBfR/S59Ce05+fxcsdz3jWGeq9N2ZszcM+WoxpsQVptqtPqEPEKfw8BymmHmL4jxjJhalWkoqFEL5cxQMo1PxD+W5lbC1arUkJVqbZEug3dOmpIF1GlQmxvyHCeB6XSZ495zzYSqSv+cZeyLSBPY50b6WmthKZUauz92yC3llUSXoWyYDPAd5m7R2gtNWdiAFBJJ4ACDSbH45aalmYAKCSSbAAcSTPINu7bbaOKWjTFkVsqE8SWIu7DkLDQdAethF4r8TvimKi60VOi8C5HBn/AEHvrwL+GmGz4nOfu03b1uFH0YzUmptm3d1HU+HvBtJa5csz7lksCBYtlDXNhyzXtO02ns8VqNSieFSm6+Vxa/pKWzaqo1dnIUCspuSAANxR5nle8z9q+PsJSBCMazdKYuv/ADNlt5E+USWtXUeS1KZUlWFmUlWHRgbEe4MC0n2piTXrVKxGTeuWyqdFJ468Trc36kytuu5/5H+s90l+Xm4itFaNk7n8/wA45B8/pGjQWWQOJK7n8J08v6wGkpVcmNeGywCJlIYwSIdo+WRpFCAhWiAgICPaEBCtA1aWGhVMNLtGnDanNSMsndQ1pS41CT0MNLMRk1KEiNObWIw8pPRluOhRKQcssskHdxoQhZNRWEtOTIksiJqYkoWAiydBPRjGKHLFkk2WPlnWYo7DwLtm/wDlKh4KTSJ5qPmT04jtf8MseK9g4vEVBuqwSkFAK53T4rm5IUfFpbieU4mk7IwdDZkYMp5XHXseB7Ez1bZuOWtTWqvB1B7g8we4Nx6T5n5Xi4Zcp7V6vFlymq57w34IpYdxWqEPUU3Wwyqp69Se59p2Ga0j3gnJeL/G1HCAotnrEaIDw6Fz90fU8hPJ3XX2a+39u0sMheo1uQHFmPRRzM8l2/4jq4pjmOWnf4UHDTgWPM/QfU4e0NqVcTU3tViza2toqjoo+6JGxPM2H75zrj4653PZV3vcDjNDY21q2GzbohS6gE2DMAOl9PoZkmuBoB+gkTVmPP20nXjjPftnbXxmOeoc1WoXN7/G19bWuBwGmmkhSuCbDX8pQo0c371lssqD93M6Y1FkGQVcYBoNT2lR8Ux4aQULMeJ94uf0LlLEMfuk+kuAyvTGUan1MOnWB4HhOk/0PWOluukjIhH5h5N+YhFZjK9s1AwgZZPljZZgQ5Y+WS5YisKhtFaSFY1oAWjxWigdruILU5fWneC1CeiRy2z93LVClJ0w0sph5uRLVKth78pXqbONr2nSUMOOku/ZRaW6NvPK2EIMBcIZ2WMwC34SFMGolnjlOblxgTHGGInUPQWU6mGnSeOM82QtGSrSl/7PCWhOkxTkpLSjmlL+6tMXaW1QAVpWJ/FxUeQ+9+UZZTGbpN5dRNXqKguzBR1JtIsJ43+zArSYOtycpVhYnjlbSwJ14HUmcrikzNmeoWP19uUgGHXva/Ezweby/smtdO+GHHvbptp/xCxldTTpgUr8ShLPbsxtl87XnN7niztck3JJJJPcnUmO1QLoo/p/eVnYnjPNMZi6W2pnxFtFH78pXZieJijpTv2HWX3QIUmWadC2ptGzBeH9/U8pE9Unyl6gmqYjkB68pWJJiAj5gOGvnwkt2Cp0yew6wziQosvvIGYnif0HtGtG9Amqk8TeaGCHw+cz1TqfbUzSw6WFvz4zeHuJUBJuOAvJysrrpqP7e0s0zcA9ZqxmoyI2WSlY2WZ0iLLERJCIMi7ARAKyW0YiBDaK0kIjWhXeYeqJI1cQDh4DUTPVHLTQw5BltEEx6bWmngiTKzYv0klgGPSSSNSmtIoYxeczmE1ykgq4edMWazDI2Eu1KUrsJ0jKC0IJJAslWlNDmPFAcAC5yMpFhpr366W07GcazngSZ63WwC1FKsLg/vTpPOPEezTQqlSOeh6qb5T58vMGeL8nC75O/iy3NMi8GoSeMn3Q/EItwOTCeTVdlaNaPa2nSIt6fvnMhwoHH9/1gl+n7/pEynn9ZGZQiYr+sbLHtIHtfif1+kWnc/SDFALN6fvrFAJhpVtwHqf0EosIoT4m9BAqY1j8ot9TAWmSbn6yxSwx8u/P+01N/AmoFivxHUgy+mIGmhAsNeAHpKlLDAd/PWWBOkxqWbW8kFkkFOoy8LEdDp7HlJhiFPHTz4e8aZ1QlZGVlorAySaFfLGyyzu427k0KxWNklrdx93Gh3+DAYS2MCDKmEFps4czuyyq+y7ayTBUspm3u7xJgtZZUsNTpyxTSEmHMPdkTcZQ1MJzlarQIHCa+HPWT1qII0l5aTTjsShlA0iTOrxWD7Sh9h1nWVmxjrTtLNKlNZcBpwi+yWmuSaVqNGcX/E3B2NN7fNTceqkH/wAj7T0FKM8+/iRv94FYndEA0gOHAB7/AM1yfQjqZx8/8Vvx/wBPP4MuHDLa9zbzEicIOFzPn6elAgF9TaE1UD5R685A+puNI2XvICJvCFPqQPqZHaPAkJUcAT56SNm7AQS0HWA5MAseUPLJKdIny68pBAKcnpUCYVwO/wCUBqhP70lF6hTUSwJj3jh5uZ6+BtKYUxlrsPvH85KmMbnrNTyQakRlfD18w8pNedJdgluOBI7cR7QxXb+U+hH6yLNFmk1DS1TxQ+8Lf9h/X6S3RCt8rA+RBmQag6wDUXj+Wp+knTPF0H2UwThjMvB7XemRqzLzVrn/AIk8D2m4uNUi44HWakxrF3HaUqFpdoIY0UqtPDLL1OlFFLEqdaBhbk9I0UnI0Y0SOUkRbRRTUu2aTUrwBge0UUXKxZNpVwkhxGGiijHO2pYqGnOH/injclFKIQMapdsxFyuTKPh6E5+PS/WKKdPLfRWcZ6nlIMW8I4WHpFFPnvSiY/WAY8UgjLdIsvWKKA+WNGigSAgd/wAoz1Cf3pFFKAiiikCiiigPaSU6JPAevKKKaxmxoouUW6RjU5CKKdbQ4Y84OTzPrFFAdVHSHFFED2g52GgYgdBwiiij/9k=" type="image/jpeg">
<style>
    :root {
        --primary-color: #4361ee;
        --primary-hover: #3a56d4;
        --dark-bg: #2a2a2a;
        --darker-bg: #1e1e1e;
        --card-bg: #333333;
        --text-color: #f0f0f0;
        --light-gray: #444444;
        --border-color: #555555;
        --error-color: #ff3333;
        --success-color: #28a745;
        --border-radius: 8px;
        --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        --transition: all 0.3s ease;
    }

    body {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: var(--dark-bg);
        margin: 0;
        padding: 0;
        color: var(--text-color);
    }

    /* Хедер */
    header {
        background-color: var(--darker-bg);
        color: var(--text-color);
        padding: 15px 20px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }

    /* Логотип и навигация слева */
    .header-left {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    header h1 {
        margin: 0;
        font-size: 22px;
        cursor: pointer;
        position: relative;
    }

    /* Выпадающее меню для достижений */
    .achievements-dropdown {
        display: none;
        position: absolute;
        background-color: var(--darker-bg);
        min-width: 200px;
        box-shadow: var(--box-shadow);
        z-index: 1;
        border-radius: var(--border-radius);
        padding: 10px 0;
        margin-top: 5px;
    }

    header h1:hover .achievements-dropdown {
        display: block;
    }

    .achievements-dropdown a {
        color: var(--text-color);
        padding: 10px 15px;
        text-decoration: none;
        display: block;
        transition: var(--transition);
    }

    .achievements-dropdown a:hover {
        background-color: var(--light-gray);
    }

    nav {
        display: flex;
        gap: 15px;
    }

    .nav-button {
        background-color: var(--light-gray);
        color: var(--text-color);
        padding: 8px 15px;
        text-decoration: none;
        border-radius: var(--border-radius);
        transition: var(--transition);
    }

    .nav-button:hover {
        background-color: var(--primary-color);
    }

    .header-right {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .user-menu {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        cursor: pointer;
        padding: 5px 10px;
        border-radius: var(--border-radius);
        transition: var(--transition);
    }

    .user-menu:hover {
        background-color: var(--light-gray);
    }

    .user-menu:hover .user-dropdown,
    .user-dropdown:hover {
        display: block;
        opacity: 1;
        visibility: visible;
    }

    .user-avatar-container {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid var(--primary-color);
        flex-shrink: 0;
    }

    .user-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: var(--transition);
    }

    .user-avatar:hover {
        opacity: 0.8;
    }

    .user-name {
        font-weight: bold;
        white-space: nowrap;
    }

    .user-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        right: 0;
        background-color: var(--darker-bg);
        min-width: 160px;
        box-shadow: var(--box-shadow);
        z-index: 100;
        border-radius: var(--border-radius);
        padding: 10px 0;
        margin-top: 5px;
        /* Добавляем плавное появление */
        opacity: 0;
        transition: opacity 0.2s ease, visibility 0.2s ease;
        visibility: hidden;
    }


    .user-menu:hover .user-dropdown {
        display: block;
    }

    .user-dropdown button {
        width: 100%;
        text-align: left;
        padding: 10px 15px;
        border: none;
        background: none;
        color: var(--text-color);
        cursor: pointer;
        transition: var(--transition);
    }

    /* Добавляем небольшой треугольник к меню */
    .user-dropdown::before {
        content: '';
        position: absolute;
        bottom: 100%;
        right: 15px;
        border-width: 8px;
        border-style: solid;
        border-color: transparent transparent var(--darker-bg) transparent;
    }

    .user-dropdown button:hover {
        background-color: var(--light-gray);
    }

    /* Основной контент */
    main {
        padding: 20px;
    }

    .page-title {
        text-align: center;
        font-size: 28px;
        margin-bottom: 30px;
        color: var(--text-color);
    }

    .articles-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
    }

    .article-card {
        background-color: var(--card-bg);
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        overflow: hidden;
        transition: var(--transition);
        cursor: pointer;
    }

    .article-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.4);
    }
    .article-preview {
        padding: 20px;
    }

    .article-title {
        font-size: 20px;
        margin-bottom: 10px;
        color: var(--text-color);
    }

    .article-summary {
        color: #aaa;
        margin-bottom: 15px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .article-meta {
        font-size: 14px;
        color: #777;
        margin-top: 15px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    .article-author {
        color: var(--primary-color);
        font-weight: bold;
        margin-left: 5px;
    }
     .author-avatar {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin-right: 8px;
        object-fit: cover;
    }

    .article-full {
        display: none;
        padding: 20px;
    }

    .article-content {
        line-height: 1.6;
        margin-bottom: 20px;
        white-space: pre-wrap;
    }

    .article-actions {
        display: flex;
        gap: 10px;
        margin-top: 20px;
    }
     .action-button {
        padding: 8px 16px;
        border-radius: var(--border-radius);
        border: none;
        cursor: pointer;
        transition: var(--transition);
        font-weight: bold;
    }

    .edit-button {
        background-color: var(--primary-color);
        color: white;
    }

    .edit-button:hover {
        background-color: var(--primary-hover);
    }

    .delete-button {
        background-color: #e63946;
        color: white;
    }

    .delete-button:hover {
        background-color: #c1121f;
    }

    .back-button {
        background-color: #555;
        color: white;
    }

    .back-button:hover {
        background-color: #666;
    }

    /* Форма статьи */
    #articleForm {
        background-color: var(--card-bg);
        padding: 20px;
        border-radius: var(--border-radius);
        margin-bottom: 30px;
        display: none;
    }
     .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    .form-control {
        width: 100%;
        padding: 10px;
        border-radius: var(--border-radius);
        border: 1px solid var(--darker-bg);
        background-color: var(--darker-bg);
        color: var(--text-color);
    }

    textarea.form-control {
        min-height: 150px;
    }
    .submit-button {
        background-color: var(--primary-color);
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
    }

    .submit-button:hover {
        background-color: var(--primary-hover);
    }

    .new-article-button {
        display: block;
        margin: 0 auto 30px;
        padding: 12px 24px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        font-weight: bold;
    }

    .new-article-button:hover {
        background-color: var(--primary-hover);
        transform: translateY(-2px);
    }

     #messengerModal {
    display: none;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    max-height: 600px;
    background-color: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    z-index: 1000;
    flex-direction: column;
}

#openMessengerButton {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: var(--accent-color);
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: var(--box-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

#conversationsList, #messagesContainer {
    overflow-y: auto;
    flex-grow: 1;
}

.message {
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 15px;
    max-width: 80%;
    word-wrap: break-word;
}

.my-message {
    background-color: var(--accent-color);
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 0;
}

.their-message {
    background-color: var(--darker-bg);
    margin-right: auto;
    border-bottom-left-radius: 0;
}

.message-time {
    font-size: 11px;
    text-align: right;
    color: rgba(255,255,255,0.7);
    margin-top: 5px;
}

    /* Категории */
    .category-filter {
        margin-bottom: 20px;
        max-width: 300px;
        margin-left: auto;
        margin-right: auto;
    }
    
    .category-filter label {
        display: block;
        margin-bottom: 5px;
        text-align: center;
    }
    
    .category-tag {
        display: inline-block;
        background-color: var(--primary-color);
        color: white;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 12px;
        margin-left: 10px;
    }

    .popular-categories {
        margin: 20px 0;
        text-align: center;
    }

    .categories-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }
    .category-button {
        background-color: var(--darker-bg);
        color: var(--text-color);
        border: none;
        padding: 5px 15px;
        border-radius: 20px;
        cursor: pointer;
        transition: var(--transition);
    }

    .category-button:hover {
        background-color: var(--primary-color);
    }

    .buttons-container {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-bottom: 30px;
    }

    /* Модальное окно для управления категориями */
    #categoriesModal {
        display: none; 
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background-color: rgba(0,0,0,0.7); 
        z-index: 1000; 
        justify-content: center; 
        align-items: center;
    }

    #categoriesModal > div {
        background-color: var(--card-bg); 
        padding: 30px; 
        border-radius: var(--border-radius); 
        max-width: 500px; 
        width: 90%; 
        max-height: 80vh; 
        overflow-y: auto;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
        header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
        }
        
        .header-left, .header-right {
            width: 100%;
            justify-content: space-between;
        }
    }

    @media (max-width: 480px) {
        nav {
            flex-wrap: wrap;
        }
        
        .buttons-container {
            flex-direction: column;
            align-items: center;
        }
        
        .new-article-button, #manageCategoriesButton {
            width: 100%;
        }
    }
</style>
</head>
<body>
    <!-- Хедер с навигацией и профилем -->
    <header>
        <div class="header-left">
            <h1>Статьи
                <div class="achievements-dropdown">
                    <a href="index.html">Главная</a>
                    <a href="about.html">О нас</a>
                    <a href="contact.html">Контакты</a>
                </div>
            </h1>
            
            <nav>
                <a href="index.html" class="nav-button">Главная</a>
                <a href="about.php" class="nav-button">Для админов</a>
                <a href="contact.html" class="nav-button">Контакты</a>
            </nav>
        </div>
        
        <div class="header-right">
            <div class="user-menu">
                <div class="user-avatar-container">
                    <img id="userAvatar" class="user-avatar" src="https://10.100.6.123:3000/uploads/default-avatar.jpg" alt="Аватар">
                </div>
                <span class="user-name" id="name">Загрузка...</span>
                <div class="user-dropdown">
                    <button id="profileButton">Профиль</button>
                    <button id="adminButton" style="display: none;">Админка</button>
                    <button id="logoutButton">Выход</button>
                </div>
            </div>
        </div>
    </header>

    <main>
        <h1 class="page-title">Статьи</h1>
        
        <div class="buttons-container">
            <button id="toggleFormButton" class="new-article-button">+ Новая статья</button>
            <button id="manageCategoriesButton" class="new-article-button">Управление категориями</button>
        </div>
        
        <div class="popular-categories">
            <h3>Популярные категории:</h3>
            <div class="categories-list" id="popularCategories"></div>
        </div>
        
        <div class="category-filter">
            <label for="categoryFilter">Фильтр по категориям:</label>
            <select id="categoryFilter" class="form-control">
                <option value="">Все категории</option>
            </select>
        </div>
        
        <form id="articleForm">
            <input type="hidden" id="articleId" value="">
            <div class="form-group">
                <label for="articleTitle">Заголовок:</label>
                <input type="text" id="articleTitle" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="articleContent">Содержание:</label>
                <textarea id="articleContent" class="form-control" required></textarea>
            </div>
            <div class="form-group">
                <label for="articleCategory">Категория:</label>
                <select id="articleCategory" class="form-control" required>
                    <option value="">Выберите категорию</option>
                </select>
            </div>
            <button type="submit" class="submit-button" id="formSubmitButton">Опубликовать</button>
            <button type="button" class="action-button back-button" id="cancelEditButton" style="display: none;">Отмена</button>
        </form>
        <div class="articles-container" id="articlesContainer">
            <!-- Статьи будут загружены сюда -->
        </div>
    </main>

    <!-- Модальное окно для управления категориями -->
    <div id="categoriesModal" style="display: none;">
        <div>
            <h2 style="margin-top: 0;">Управление категориями</h2>
            
            <div class="form-group">
                <label for="newCategoryName">Новая категория:</label>
                <input type="text" id="newCategoryName" class="form-control" placeholder="Название категории">
            </div>
            <button id="addCategoryButton" class="submit-button">Добавить</button>
            
            <h3 style="margin-top: 30px;">Список категорий:</h3>
            <ul id="categoriesList" style="list-style: none; padding: 0;">
                <!-- Категории будут загружены сюда -->
            </ul>
            
            <button id="closeModalButton" class="action-button back-button" style="margin-top: 20px;">Закрыть</button>
        </div>
    </div>

    <script>
        // Проверка авторизации
        function checkAuthorization() {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = 'login.html';
            }
        }

        // Функция для проверки роли пользователя
        function checkUserRole() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    return payload.role;
                } catch (e) {
                    console.error('Ошибка декодирования токена:', e);
                }
            }
            return null;
        }

        // Получаем токен из localStorage
        const token = localStorage.getItem('token');
        
        // DOM элементы
        const articlesContainer = document.getElementById('articlesContainer');
        const articleForm = document.getElementById('articleForm');
        const toggleFormButton = document.getElementById('toggleFormButton');
        const manageCategoriesButton = document.getElementById('manageCategoriesButton');
        const articleIdInput = document.getElementById('articleId');
        const articleTitleInput = document.getElementById('articleTitle');
        const articleContentInput = document.getElementById('articleContent');
        const articleCategoryInput = document.getElementById('articleCategory');
        const formSubmitButton = document.getElementById('formSubmitButton');
        const cancelEditButton = document.getElementById('cancelEditButton');
        const categoryFilter = document.getElementById('categoryFilter');
        const popularCategories = document.getElementById('popularCategories');
        const categoriesModal = document.getElementById('categoriesModal');
        const newCategoryName = document.getElementById('newCategoryName');
        const addCategoryButton = document.getElementById('addCategoryButton');
        const categoriesList = document.getElementById('categoriesList');
        const closeModalButton = document.getElementById('closeModalButton');
        
        // Элементы профиля
        const profileButton = document.getElementById('profileButton');
        const adminButton = document.getElementById('adminButton');
        const logoutButton = document.getElementById('logoutButton');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('name');
        
        // Текущий режим работы формы
        let formMode = 'create';
        let currentArticleId = null;
        
        // Показываем/скрываем форму
        toggleFormButton.addEventListener('click', () => {
            resetForm();
            articleForm.style.display = articleForm.style.display === 'none' ? 'block' : 'none';
        });
        
        // Сброс формы
        function resetForm() {
            formMode = 'create';
            currentArticleId = null;
            articleIdInput.value = '';
            articleTitleInput.value = '';
            articleContentInput.value = '';
            articleCategoryInput.value = '';
            formSubmitButton.textContent = 'Опубликовать';
            cancelEditButton.style.display = 'none';
        }
        
        // Отмена редактирования
        cancelEditButton.addEventListener('click', () => {
            resetForm();
            articleForm.style.display = 'none';
        });
        
        // Обработчик отправки формы
        articleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = articleTitleInput.value.trim();
            const content = articleContentInput.value.trim();
            const categoryId = articleCategoryInput.value;
            
            if (!title || !content || !categoryId) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            if (formMode === 'create') {
                createArticle(title, content, categoryId);
            } else {
                updateArticle(currentArticleId, title, content, categoryId);
            }
        });
        
        // Загрузка категорий
        async function loadCategories() {
            try {
                const response = await fetch('/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Ошибка загрузки категорий');
                
                const categories = await response.json();
                
                // Заполняем фильтр и форму
                categoryFilter.innerHTML = '<option value="">Все категории</option>';
                articleCategoryInput.innerHTML = '<option value="">Выберите категорию</option>';
                popularCategories.innerHTML = '';
                
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    
                    categoryFilter.appendChild(option.cloneNode(true));
                    articleCategoryInput.appendChild(option);
                    
                    // Добавляем популярные категории
                    const catButton = document.createElement('button');
                    catButton.className = 'category-button';
                    catButton.textContent = category.name;
                    catButton.onclick = () => {
                        categoryFilter.value = category.id;
                        loadArticles(category.id);
                    };
                    popularCategories.appendChild(catButton);
                });
                
                return categories;
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
                return [];
            }
        }
        
        // Загрузка популярных категорий
        async function loadPopularCategories() {
            try {
                const response = await fetch('/api/categories/popular', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Ошибка загрузки популярных категорий');
                
                const categories = await response.json();
                popularCategories.innerHTML = '';
                
                categories.forEach(category => {
                    const catButton = document.createElement('button');
                    catButton.className = 'category-button';
                    catButton.textContent = category.name;
                    catButton.onclick = () => {
                        categoryFilter.value = category.id;
                        loadArticles(category.id);
                    };
                    popularCategories.appendChild(catButton);
                });
            } catch (error) {
                console.error('Ошибка:', error);
            }
        }
        
        // Загрузка статей с информацией об авторах
        async function loadArticles(categoryId = '') {
            try {
                if (!token) {
                    throw new Error('Необходима авторизация');
                }
                
                const url = categoryId ? `/api/articles?category_id=${categoryId}` : '/api/articles';
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Ошибка загрузки статей');
                }
                
                const articles = await response.json();
                
                // Загружаем информацию об авторах для каждой статьи
                const articlesWithAuthors = await Promise.all(articles.map(async article => {
                    try {
                        const authorResponse = await fetch(`/api/users/${article.author_id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        
                        if (authorResponse.ok) {
                            const authorData = await authorResponse.json();
                            return {
                                ...article,
                                author_name: authorData.name,
                                author_last_name: authorData.last_name,
                                author_avatar: authorData.profile_image
                            };
                        }
                        return article;
                    } catch (e) {
                        console.error('Ошибка загрузки автора:', e);
                        return article;
                    }
                }));
                
                renderArticles(articlesWithAuthors);
            } catch (error) {
                console.error('Ошибка:', error);
                articlesContainer.innerHTML = `<div class="error-message">${error.message}</div>`;
            }
        }
        
        // Отображение статей с авторами
        function renderArticles(articles) {
            articlesContainer.innerHTML = '';
            
            const currentUser = JSON.parse(atob(token.split('.')[1]));
            const currentUserId = currentUser?.id;
            const currentUserRole = currentUser?.role;
            
            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'article-card';
                
                const summary = article.content.length > 200 
                    ? article.content.substring(0, 200) + '...' 
                    : article.content;
                
                const authorName = article.author_name && article.author_last_name 
                    ? `${article.author_name} ${article.author_last_name}` 
                    : 'Неизвестный автор';
                
                // Функция для генерации аватарки с обработкой ошибок
                const renderAvatar = (avatarPath) => `
                    <img src="/uploads/${avatarPath}" 
                         class="author-avatar" 
                         alt="${escapeHtml(authorName)}"
                         onerror='/uploads/default-avatar.jpg'>
                `;
                
                const isAuthorOrAdmin = article.author_id === currentUserId || 
                                      ['admin', 'moderator'].includes(currentUserRole);
                
                const actionsHtml = isAuthorOrAdmin 
                    ? `<div class="article-actions">
                          <button class="action-button back-button" onclick="hideFullArticle(this)">Назад</button>
                          <button class="action-button edit-button" onclick="editArticle(${article.id}, event)">Редактировать</button>
                          <button class="action-button delete-button" onclick="deleteArticle(${article.id}, event)">Удалить</button>
                       </div>`
                    : `<div class="article-actions">
                          <button class="action-button back-button" onclick="hideFullArticle(this)">Назад</button>
                       </div>`;
                
                articleCard.innerHTML = `
                    <div class="article-preview" onclick="showFullArticle(this)">
                        <h3 class="article-title">${escapeHtml(article.title)}</h3>
                        <div class="article-summary">${escapeHtml(summary)}</div>
                        <div class="article-meta">
                            ${article.author_avatar ? renderAvatar(article.author_avatar) : ''}
                            Автор: <span class="article-author">${escapeHtml(authorName)}</span>
                            ${article.category_name ? `<span class="category-tag">${escapeHtml(article.category_name)}</span>` : ''}
                        </div>
                    </div>
                    <div class="article-full" style="display: none;">
                        <h3 class="article-title">${escapeHtml(article.title)}</h3>
                        <div class="article-content">${escapeHtml(article.content)}</div>
                        <div class="article-meta">
                            ${article.author_avatar ? renderAvatar(article.author_avatar) : ''}
                            Автор: <span class="article-author">${escapeHtml(authorName)}</span>
                            ${article.category_name ? `<span class="category-tag">${escapeHtml(article.category_name)}</span>` : ''}
                        </div>
                        ${actionsHtml}
                    </div>
                `;
                
                articlesContainer.appendChild(articleCard);
            });
        }
        
        // Показать полную статью
        function showFullArticle(element) {
            const card = element.closest('.article-card');
            card.querySelector('.article-preview').style.display = 'none';
            card.querySelector('.article-full').style.display = 'block';
        }
        
        // Скрыть полную статью
        function hideFullArticle(element) {
            const card = element.closest('.article-card');
            card.querySelector('.article-full').style.display = 'none';
            card.querySelector('.article-preview').style.display = 'block';
        }
        
        // Редактирование статьи
        function editArticle(articleId, event) {
            event.stopPropagation();
            
            fetch(`/api/articles/${articleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки статьи');
                return response.json();
            })
            .then(article => {
                formMode = 'edit';
                currentArticleId = articleId;
                articleIdInput.value = articleId;
                articleTitleInput.value = article.title;
                articleContentInput.value = article.content;
                articleCategoryInput.value = article.category_id || '';
                formSubmitButton.textContent = 'Сохранить изменения';
                cancelEditButton.style.display = 'inline-block';
                
                articleForm.style.display = 'block';
                articleForm.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert(error.message);
            });
        }
        
        // Удаление статьи
        function deleteArticle(articleId, event) {
            event.stopPropagation();
            
            if (!confirm('Вы уверены, что хотите удалить эту статью?')) {
                return;
            }
            
            fetch(`/api/articles/${articleId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка удаления статьи');
                return response.json();
            })
            .then(data => {
                alert('Статья успешно удалена');
                loadArticles(categoryFilter.value);
            })
            .catch(error => {
                console.error('Ошибка:', error);
                if (error.message.includes('403')) {
                    alert('У вас нет прав на удаление этой статьи');
                } else {
                    alert(error.message);
                }
            });
        }
        
        // Создание статьи
        function createArticle(title, content, categoryId) {
            fetch('/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, category_id: categoryId })
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка создания статьи');
                return response.json();
            })
            .then(data => {
                alert('Статья успешно создана');
                resetForm();
                articleForm.style.display = 'none';
                loadArticles();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert(error.message);
            });
        }
        
        // Обновление статьи
        function updateArticle(articleId, title, content, categoryId) {
            fetch(`/api/articles/${articleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, content, category_id: categoryId })
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка обновления статьи');
                return response.json();
            })
            .then(data => {
                alert('Статья успешно обновлена');
                resetForm();
                articleForm.style.display = 'none';
                loadArticles();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert(error.message);
            });
        }
        
        // Управление категориями
        manageCategoriesButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Ошибка загрузки категорий');
                
                const categories = await response.json();
                categoriesList.innerHTML = '';
                
                categories.forEach(category => {
                    const li = document.createElement('li');
                    li.style.display = 'flex';
                    li.style.justifyContent = 'space-between';
                    li.style.alignItems = 'center';
                    li.style.marginBottom = '10px';
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = category.name;
                    
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Удалить';
                    deleteButton.className = 'action-button back-button';
                    deleteButton.style.padding = '5px 10px';
                    deleteButton.onclick = () => deleteCategory(category.id);
                    
                    li.appendChild(nameSpan);
                    li.appendChild(deleteButton);
                    categoriesList.appendChild(li);
                });
                
                categoriesModal.style.display = 'flex';
            } catch (error) {
                console.error('Ошибка:', error);
                alert(error.message);
            }
        });
        
        // Добавление категории
        addCategoryButton.addEventListener('click', () => {
            const name = newCategoryName.value.trim();
            if (!name) {
                alert('Введите название категории');
                return;
            }
            
            fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка создания категории');
                return response.json();
            })
            .then(data => {
                alert('Категория успешно создана');
                newCategoryName.value = '';
                loadCategories();
                loadPopularCategories();
                
                // Обновляем список в модальном окне
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.marginBottom = '10px';
                
                const nameSpan = document.createElement('span');
                nameSpan.textContent = name;
                
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Удалить';
                deleteButton.className = 'action-button back-button';
                deleteButton.style.padding = '5px 10px';
                deleteButton.onclick = () => deleteCategory(data.id);
                
                li.appendChild(nameSpan);
                li.appendChild(deleteButton);
                categoriesList.appendChild(li);
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert(error.message);
            });
        });
        
        // Удаление категории
        function deleteCategory(categoryId) {
            if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
            
            fetch(`/api/categories/${categoryId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка удаления категории');
                return response.json();
            })
            .then(data => {
                alert('Категория успешно удалена');
                loadCategories();
                loadPopularCategories();
                
                // Удаляем из списка в модальном окне
                const items = categoriesList.querySelectorAll('li');
                items.forEach(item => {
                    if (item.querySelector('button').onclick.toString().includes(categoryId)) {
                        item.remove();
                    }
                });
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert(error.message);
            });
        }
        
        // Закрытие модального окна
        closeModalButton.addEventListener('click', () => {
            categoriesModal.style.display = 'none';
        });
        
        // Обработчик фильтра
        categoryFilter.addEventListener('change', () => {
            loadArticles(categoryFilter.value);
        });
        
        // Экранирование HTML
        function escapeHtml(text) {
            const map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, m => map[m]);
        }

        // Загрузка информации о пользователе
        async function fetchUserInfo() {
            try {
                const response = await fetch('/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке информации о пользователе');
                }
                
                const data = await response.json();
                userName.textContent = data.name || 'Пользователь';
                
                // Обновляем аватар
                if (data.profile_image) {
                    userAvatar.src = `https://10.100.6.123:3000/uploads/${data.profile_image}?t=${Date.now()}`;
                    userAvatar.onerror = () => {
                        userAvatar.src = '/uploads/default-avatar.jpg';
                    };
                }
                
                // Проверяем права администратора
                await checkAdminButton();
            } catch (error) {
                console.error('Ошибка:', error);
                userName.textContent = 'Ошибка загрузки';
                userAvatar.src = '/images/default-avatar.png';
            }
        }

        // Проверка прав администратора
        async function checkAdminButton() {
            try {
                const response = await fetch('/api/users/me/admin-button', { 
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Ошибка при проверке прав администратора');

                const data = await response.json();

                // Показываем кнопку админа, если пользователь имеет права
                if (data.showAdminButton) {
                    adminButton.style.display = 'block';
                } else {
                    adminButton.style.display = 'none';
                }
            } catch (error) {
                console.error('Ошибка при проверке прав администратора:', error);
                adminButton.style.display = 'none';
            }
        } // <-- Эта скобка была пропущена
        
        // Обработчики событий для кнопок профиля
        profileButton.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
        
        adminButton.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
        
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });

        // Добавляем обработчики для более стабильной работы выпадающего меню
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.querySelector('.user-dropdown');
        let dropdownTimeout;

        userMenu.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
            userDropdown.style.display = 'block';
            setTimeout(() => {
                userDropdown.style.opacity = '1';
                userDropdown.style.visibility = 'visible';
            }, 10);
        });

        userMenu.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                userDropdown.style.opacity = '0';
                userDropdown.style.visibility = 'hidden';
                setTimeout(() => {
                    userDropdown.style.display = 'none';
                }, 200);
            }, 300);
        });

        userDropdown.addEventListener('mouseenter', () => {
            clearTimeout(dropdownTimeout);
        });

        userDropdown.addEventListener('mouseleave', () => {
            dropdownTimeout = setTimeout(() => {
                userDropdown.style.opacity = '0';
                userDropdown.style.visibility = 'hidden';
                setTimeout(() => {
                    userDropdown.style.display = 'none';
                }, 200);
            }, 300);
        });

        // Инициализация
        checkAuthorization();
        
        articleForm.style.display = 'none';
        categoriesModal.style.display = 'none';
        
        fetchUserInfo();
        loadCategories();
        loadPopularCategories();
        loadArticles();
    </script>
</body>
</html>
