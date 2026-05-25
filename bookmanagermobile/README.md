# Book Manager Mobile App - `bookmanagermobile`

Tai lieu nay la huong dan day du de tao app Android Studio bang Java cho du an Book Manager. Toan bo code mau duoc viet theo package `com.bookmanagermobile` va ket noi toi backend Node.js hien co cua project.

## 1. Muc tieu app

App mobile se co cac chuc nang sau:

- Dang nhap, dang ky
- Xem danh sach sach
- Xem chi tiet sach va reviews
- Them review cho sach
- Xem profile ca nhan
- Man hinh admin de quan ly user
- Man hinh admin de them/sua/xoa sach

Backend dang dung JWT va role `user` / `admin`, nen app phai luu token sau khi login.

## 2. Cau truc thu muc

Day la cau truc de xay app `bookmanagermobile`:

```text
bookmanagermobile/
├─ settings.gradle
├─ build.gradle
├─ gradle.properties
├─ README.md
└─ app/
   ├─ build.gradle
   └─ src/main/
      ├─ AndroidManifest.xml
      ├─ java/com/bookmanagermobile/
      │  ├─ adapter/
      │  │  ├─ BookAdapter.java
      │  │  ├─ ReviewAdapter.java
      │  │  └─ UserAdapter.java
      │  ├─ model/
      │  │  ├─ AuthResponse.java
      │  │  ├─ Book.java
      │  │  ├─ BookDetailResponse.java
      │  │  ├─ LoginRequest.java
      │  │  ├─ RegisterRequest.java
      │  │  ├─ Review.java
      │  │  ├─ ReviewRequest.java
      │  │  └─ User.java
      │  ├─ network/
      │  │  ├─ ApiClient.java
      │  │  └─ ApiService.java
      │  ├─ storage/
      │  │  └─ SessionManager.java
      │  └─ ui/
      │     ├─ AdminUsersActivity.java
      │     ├─ BookDetailActivity.java
      │     ├─ BookFormActivity.java
      │     ├─ BookListActivity.java
      │     ├─ LoginActivity.java
      │     ├─ ProfileActivity.java
      │     ├─ RegisterActivity.java
      │     ├─ ReviewListActivity.java
      │     └─ SplashActivity.java
      └─ res/
         ├─ layout/
         │  ├─ activity_admin_users.xml
         │  ├─ activity_book_detail.xml
         │  ├─ activity_book_form.xml
         │  ├─ activity_book_list.xml
         │  ├─ activity_login.xml
         │  ├─ activity_profile.xml
         │  ├─ activity_register.xml
         │  ├─ activity_review_list.xml
         │  ├─ activity_splash.xml
         │  ├─ item_book.xml
         │  ├─ item_review.xml
         │  └─ item_user.xml
         ├─ drawable/
         │  └─ bg_splash.xml
         └─ values/
            ├─ colors.xml
            ├─ strings.xml
            └─ themes.xml
```

## 3. Cach chay tren Android Studio

### Buoc 1: Mo project

- Mo Android Studio.
- Chon `Open` va mo thu muc `bookmanagermobile`.
- Dam bao package name la `com.bookmanagermobile`.

### Buoc 2: Chinh backend URL

- Neu chay emulator Android: dung `http://10.0.2.2:9999/api/`
- Neu chay dien thoai that: dung IP may tinh, vi du `http://192.168.1.10:9999/api/`

### Buoc 3: Chay backend truoc

O thu muc backend Node.js:

```bash
npm install
npm run dev
```

### Buoc 4: Chay app

- Run tren emulator hoac dien thoai.
- Login bang tai khoan mau trong backend.

## 4. Gradle files

### `settings.gradle`

```gradle
rootProject.name = "bookmanagermobile"
include ':app'
```

### `build.gradle` cap project

```gradle
plugins {
    id 'com.android.application' version '8.5.2' apply false
}
```

### `gradle.properties`

```properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
```

### `app/build.gradle`

```gradle
plugins {
    id 'com.android.application'
}

android {
    namespace 'com.bookmanagermobile'
    compileSdk 34

    defaultConfig {
        applicationId "com.bookmanagermobile"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'com.google.android.material:material:1.12.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.2.0'
    implementation 'androidx.recyclerview:recyclerview:1.4.0'
    implementation 'androidx.cardview:cardview:1.0.0'

    implementation 'com.squareup.retrofit2:retrofit:2.11.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.11.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'

    implementation 'androidx.lifecycle:lifecycle-livedata:2.8.7'
    implementation 'androidx.lifecycle:lifecycle-viewmodel:2.8.7'

    implementation 'com.github.bumptech.glide:glide:4.16.0'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'
}
```

## 5. Manifest

### `app/src/main/AndroidManifest.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.BookManagerMobile">

        <activity android:name=".ui.AdminUsersActivity" />
        <activity android:name=".ui.ProfileActivity" />
        <activity android:name=".ui.ReviewListActivity" />
        <activity android:name=".ui.BookFormActivity" />
        <activity android:name=".ui.BookDetailActivity" />
        <activity android:name=".ui.BookListActivity" />
        <activity android:name=".ui.RegisterActivity" />
        <activity android:name=".ui.LoginActivity" />
        <activity android:name=".ui.SplashActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## 6. Mau giao dien

### `app/src/main/res/values/colors.xml`

```xml
<resources>
    <color name="app_background">#FAF7F2</color>
    <color name="surface">#FFFFFF</color>
    <color name="primary">#102A43</color>
    <color name="secondary">#D97706</color>
    <color name="text_primary">#102A43</color>
    <color name="text_secondary">#64748B</color>
</resources>
```

### `app/src/main/res/values/strings.xml`

```xml
<resources>
    <string name="app_name">Book Manager Mobile</string>
</resources>
```

### `app/src/main/res/values/themes.xml`

```xml
<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.BookManagerMobile" parent="Theme.Material3.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorSecondary">@color/secondary</item>
        <item name="android:statusBarColor">@color/primary</item>
        <item name="android:navigationBarColor">@color/app_background</item>
    </style>
</resources>
```

### `app/src/main/res/drawable/bg_splash.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <gradient
        android:angle="90"
        android:startColor="#102A43"
        android:endColor="#1F3A5F" />
</shape>
```

## 7. API mapping

Backend routes dung cho app mobile:

- `POST /api/users/login` - dang nhap
- `POST /api/users` - dang ky
- `GET /api/users/profile` - lay profile
- `GET /api/books` - lay sach
- `GET /api/books/:id` - lay chi tiet sach
- `POST /api/books` - them sach
- `PUT /api/books/:id` - sua sach
- `DELETE /api/books/:id` - xoa sach
- `GET /api/books/suggestions?genre=...` - goi y sach
- `GET /api/books/:bookId/reviews` - reviews cua sach
- `GET /api/reviews` - lay reviews
- `POST /api/reviews` - them review
- `PUT /api/reviews/:id` - sua review
- `DELETE /api/reviews/:id` - xoa review
- `GET /api/users` - admin xem user
- `PUT /api/users/:id` - admin/user sua user
- `DELETE /api/users/:id` - admin xoa user

## 8. Full code backend client cho Android

### 8.1 Models

#### `model/LoginRequest.java`

```java
package com.bookmanagermobile.model;

public class LoginRequest {
    private String email;
    private String password;

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() { return email; }
    public String getPassword() { return password; }
}
```

#### `model/RegisterRequest.java`

```java
package com.bookmanagermobile.model;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;

    public RegisterRequest(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
}
```

#### `model/AuthResponse.java`

```java
package com.bookmanagermobile.model;

public class AuthResponse {
    private String _id;
    private String name;
    private String email;
    private String token;

    public String getId() { return _id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getToken() { return token; }
}
```

#### `model/User.java`

```java
package com.bookmanagermobile.model;

public class User {
    private String _id;
    private String name;
    private String email;
    private String role;

    public String getId() { return _id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
}
```

#### `model/Book.java`

```java
package com.bookmanagermobile.model;

import java.io.Serializable;

public class Book implements Serializable {
    private String _id;
    private String title;
    private String author;
    private String description;
    private String publishedDate;
    private String genre;
    private Double ratingAverage;
    private Integer ratingCount;

    public String getId() { return _id; }
    public String getTitle() { return title; }
    public String getAuthor() { return author; }
    public String getDescription() { return description; }
    public String getPublishedDate() { return publishedDate; }
    public String getGenre() { return genre; }
    public Double getRatingAverage() { return ratingAverage; }
    public Integer getRatingCount() { return ratingCount; }

    public void setTitle(String title) { this.title = title; }
    public void setAuthor(String author) { this.author = author; }
    public void setDescription(String description) { this.description = description; }
    public void setPublishedDate(String publishedDate) { this.publishedDate = publishedDate; }
    public void setGenre(String genre) { this.genre = genre; }
}
```

#### `model/Review.java`

```java
package com.bookmanagermobile.model;

import java.io.Serializable;

public class Review implements Serializable {
    private String _id;
    private String bookId;
    private String comment;
    private Integer rating;
    private String createdAt;

    public String getId() { return _id; }
    public String getBookId() { return bookId; }
    public String getComment() { return comment; }
    public Integer getRating() { return rating; }
    public String getCreatedAt() { return createdAt; }

    public void setBookId(String bookId) { this.bookId = bookId; }
    public void setComment(String comment) { this.comment = comment; }
    public void setRating(Integer rating) { this.rating = rating; }
}
```

#### `model/ReviewRequest.java`

```java
package com.bookmanagermobile.model;

public class ReviewRequest {
    private String bookId;
    private Integer rating;
    private String comment;

    public ReviewRequest(String bookId, Integer rating, String comment) {
        this.bookId = bookId;
        this.rating = rating;
        this.comment = comment;
    }
}
```

#### `model/BookDetailResponse.java`

```java
package com.bookmanagermobile.model;

import java.util.List;

public class BookDetailResponse extends Book {
    private Double ratingAverage;
    private Integer ratingCount;
    private List<Review> reviews;

    @Override
    public Double getRatingAverage() { return ratingAverage; }

    @Override
    public Integer getRatingCount() { return ratingCount; }

    public List<Review> getReviews() { return reviews; }
}
```

### 8.2 Session storage

#### `storage/SessionManager.java`

```java
package com.bookmanagermobile.storage;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "bookmanagermobile_session";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_USER_JSON = "user_json";

    private final SharedPreferences pref;

    public SessionManager(Context context) {
        pref = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    public void saveToken(String token) {
        pref.edit().putString(KEY_TOKEN, token).apply();
    }

    public String getToken() {
        return pref.getString(KEY_TOKEN, null);
    }

    public void saveUserJson(String userJson) {
        pref.edit().putString(KEY_USER_JSON, userJson).apply();
    }

    public String getUserJson() {
        return pref.getString(KEY_USER_JSON, null);
    }

    public void clear() {
        pref.edit().clear().apply();
    }
}
```

### 8.3 Network layer

#### `network/ApiClient.java`

```java
package com.bookmanagermobile.network;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    private static final String BASE_URL = "http://10.0.2.2:9999/api/";
    private static Retrofit retrofit;

    public static Retrofit getClient(String token) {
        HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
        logging.setLevel(HttpLoggingInterceptor.Level.BODY);

        OkHttpClient.Builder builder = new OkHttpClient.Builder()
                .addInterceptor(logging);

        if (token != null && !token.isEmpty()) {
            builder.addInterceptor(chain -> {
                okhttp3.Request request = chain.request().newBuilder()
                        .addHeader("Authorization", "Bearer " + token)
                        .build();
                return chain.proceed(request);
            });
        }

        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(builder.build())
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}
```

#### `network/ApiService.java`

```java
package com.bookmanagermobile.network;

import java.util.List;

import com.bookmanagermobile.model.AuthResponse;
import com.bookmanagermobile.model.Book;
import com.bookmanagermobile.model.BookDetailResponse;
import com.bookmanagermobile.model.LoginRequest;
import com.bookmanagermobile.model.RegisterRequest;
import com.bookmanagermobile.model.Review;
import com.bookmanagermobile.model.ReviewRequest;
import com.bookmanagermobile.model.User;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface ApiService {
    @POST("users/login")
    Call<AuthResponse> login(@Body LoginRequest body);

    @POST("users")
    Call<AuthResponse> register(@Body RegisterRequest body);

    @GET("users/profile")
    Call<User> getProfile();

    @GET("users")
    Call<List<User>> getUsers();

    @PUT("users/{id}")
    Call<User> updateUser(@Path("id") String id, @Body User user);

    @DELETE("users/{id}")
    Call<Void> deleteUser(@Path("id") String id);

    @GET("books")
    Call<List<Book>> getBooks(@Query("author") String author, @Query("genre") String genre);

    @GET("books/{id}")
    Call<BookDetailResponse> getBookDetail(@Path("id") String id);

    @POST("books")
    Call<Book> createBook(@Body Book body);

    @PUT("books/{id}")
    Call<Book> updateBook(@Path("id") String id, @Body Book body);

    @DELETE("books/{id}")
    Call<Void> deleteBook(@Path("id") String id);

    @GET("books/suggestions")
    Call<List<Book>> getSuggestions(@Query("genre") String genre);

    @GET("books/{bookId}/reviews")
    Call<List<Review>> getReviewsByBook(@Path("bookId") String bookId);

    @GET("reviews")
    Call<List<Review>> getReviews();

    @POST("reviews")
    Call<Review> createReview(@Body ReviewRequest body);

    @PUT("reviews/{id}")
    Call<Review> updateReview(@Path("id") String id, @Body ReviewRequest body);

    @DELETE("reviews/{id}")
    Call<Void> deleteReview(@Path("id") String id);
}
```

## 9. Layout XML

### `res/layout/activity_splash.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/bg_splash">

    <LinearLayout
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:gravity="center"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Book Manager"
            android:textColor="@android:color/white"
            android:textSize="30sp"
            android:textStyle="bold" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="Mobile App"
            android:textColor="#E2E8F0" />
    </LinearLayout>
</androidx.constraintlayout.widget.ConstraintLayout>
```

### `res/layout/activity_login.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/app_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="24dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Dang nhap"
            android:textSize="30sp"
            android:textStyle="bold"
            android:textColor="@color/text_primary" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="Quan ly sach va reviews"
            android:textColor="@color/text_secondary" />

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="28dp">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etEmail"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Email"
                android:inputType="textEmailAddress" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp">

            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etPassword"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Mat khau"
                android:inputType="textPassword" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnLogin"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:layout_marginTop="24dp"
            android:text="Dang nhap" />

        <TextView
            android:id="@+id/tvGoRegister"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginTop="18dp"
            android:text="Chua co tai khoan? Dang ky ngay"
            android:textColor="@color/secondary" />

        <TextView
            android:id="@+id/tvStatus"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="18dp"
            android:textColor="@color/text_secondary" />
    </LinearLayout>
</ScrollView>
```

### `res/layout/activity_register.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/app_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="24dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Dang ky"
            android:textSize="30sp"
            android:textStyle="bold"
            android:textColor="@color/text_primary" />

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="24dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etName"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Ho ten" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etEmail"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Email"
                android:inputType="textEmailAddress" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="16dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etPassword"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Mat khau"
                android:inputType="textPassword" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnRegister"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:layout_marginTop="24dp"
            android:text="Tao tai khoan" />
    </LinearLayout>
</ScrollView>
```

### `res/layout/activity_book_list.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/app_background">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <com.google.android.material.appbar.MaterialToolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:background="@color/surface"
            android:title="Book Manager"
            app:titleTextColor="@color/text_primary" />
    </com.google.android.material.appbar.AppBarLayout>

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:orientation="vertical"
        android:padding="16dp"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etSearch"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Tim theo author hoac genre" />
        </com.google.android.material.textfield.TextInputLayout>

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/rvBooks"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:layout_marginTop="12dp" />

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnRefresh"
            android:layout_width="match_parent"
            android:layout_height="52dp"
            android:text="Tai lai" />
    </LinearLayout>
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

### `res/layout/item_book.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="14dp"
    app:cardCornerRadius="20dp"
    app:cardElevation="4dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <TextView
            android:id="@+id/tvTitle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:textSize="18sp"
            android:textStyle="bold"
            android:textColor="@color/text_primary" />

        <TextView
            android:id="@+id/tvAuthor"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:textColor="@color/text_secondary" />

        <TextView
            android:id="@+id/tvMeta"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:textColor="@color/secondary" />
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
```

### `res/layout/activity_book_detail.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/app_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:id="@+id/tvTitle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:textSize="26sp"
            android:textStyle="bold"
            android:textColor="@color/text_primary" />

        <TextView
            android:id="@+id/tvAuthor"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:textColor="@color/text_secondary" />

        <com.google.android.material.card.MaterialCardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="18dp"
            app:cardCornerRadius="18dp">

            <LinearLayout
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="vertical"
                android:padding="16dp">

                <TextView
                    android:id="@+id/tvRating"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:textStyle="bold"
                    android:textSize="20sp"
                    android:textColor="@color/text_primary" />

                <TextView
                    android:id="@+id/tvDescription"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:textColor="@color/text_secondary" />
            </LinearLayout>
        </com.google.android.material.card.MaterialCardView>

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/rvReviews"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="18dp" />

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnAddReview"
            android:layout_width="match_parent"
            android:layout_height="52dp"
            android:layout_marginTop="18dp"
            android:text="Them review" />
    </LinearLayout>
</ScrollView>
```

### `res/layout/activity_book_form.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<ScrollView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@color/app_background">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="20dp">

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Book form"
            android:textSize="26sp"
            android:textStyle="bold"
            android:textColor="@color/text_primary" />

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etTitle"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Title" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="14dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etAuthor"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Author" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="14dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etGenre"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Genre" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="14dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etPublishedDate"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:hint="Published date" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.textfield.TextInputLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="14dp">
            <com.google.android.material.textfield.TextInputEditText
                android:id="@+id/etDescription"
                android:layout_width="match_parent"
                android:layout_height="160dp"
                android:hint="Description"
                android:gravity="top"
                android:inputType="textMultiLine" />
        </com.google.android.material.textfield.TextInputLayout>

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnSaveBook"
            android:layout_width="match_parent"
            android:layout_height="56dp"
            android:layout_marginTop="22dp"
            android:text="Save book" />
    </LinearLayout>
</ScrollView>
```

### `res/layout/activity_review_list.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/app_background"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Your reviews"
        android:textSize="24sp"
        android:textStyle="bold"
        android:textColor="@color/text_primary" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvReviews"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="12dp" />
</LinearLayout>
```

### `res/layout/activity_profile.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/app_background"
    android:padding="20dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Profile"
        android:textSize="28sp"
        android:textStyle="bold"
        android:textColor="@color/text_primary" />

    <com.google.android.material.card.MaterialCardView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="18dp"
        app:cardCornerRadius="20dp">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <TextView
                android:id="@+id/tvName"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvEmail"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp" />

            <TextView
                android:id="@+id/tvRole"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp" />
        </LinearLayout>
    </com.google.android.material.card.MaterialCardView>

    <com.google.android.material.button.MaterialButton
        android:id="@+id/btnLogout"
        android:layout_width="match_parent"
        android:layout_height="52dp"
        android:layout_marginTop="18dp"
        android:text="Logout" />
</LinearLayout>
```

### `res/layout/activity_admin_users.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="@color/app_background"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Admin Dashboard"
        android:textSize="26sp"
        android:textStyle="bold"
        android:textColor="@color/text_primary" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvUsers"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="12dp" />
</LinearLayout>
```

### `res/layout/item_review.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="12dp"
    app:cardCornerRadius="18dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <TextView
            android:id="@+id/tvRating"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvComment"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp" />

        <TextView
            android:id="@+id/tvMeta"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:textColor="@color/text_secondary" />
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
```

### `res/layout/item_user.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="12dp"
    app:cardCornerRadius="18dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <TextView
            android:id="@+id/tvName"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/tvEmail"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp" />

        <TextView
            android:id="@+id/tvRole"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp" />
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
```

## 10. Java code cho adapters

### `adapter/BookAdapter.java`

```java
package com.bookmanagermobile.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bookmanagermobile.R;
import com.bookmanagermobile.model.Book;

import java.util.ArrayList;
import java.util.List;

public class BookAdapter extends RecyclerView.Adapter<BookAdapter.BookViewHolder> {
    public interface OnBookClickListener {
        void onBookClick(Book book);
        void onEditClick(Book book);
        void onDeleteClick(Book book);
    }

    private final List<Book> books = new ArrayList<>();
    private final OnBookClickListener listener;

    public BookAdapter(OnBookClickListener listener) {
        this.listener = listener;
    }

    public void submitList(List<Book> newBooks) {
        books.clear();
        if (newBooks != null) books.addAll(newBooks);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public BookViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_book, parent, false);
        return new BookViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BookViewHolder holder, int position) {
        Book book = books.get(position);
        holder.tvTitle.setText(book.getTitle());
        holder.tvAuthor.setText(book.getAuthor());

        String meta = (book.getGenre() != null ? book.getGenre() : "No genre") +
                " | Rating: " + (book.getRatingAverage() != null ? book.getRatingAverage() : 0);
        holder.tvMeta.setText(meta);

        holder.itemView.setOnClickListener(v -> listener.onBookClick(book));
    }

    @Override
    public int getItemCount() {
        return books.size();
    }

    static class BookViewHolder extends RecyclerView.ViewHolder {
        TextView tvTitle, tvAuthor, tvMeta;

        public BookViewHolder(@NonNull View itemView) {
            super(itemView);
            tvTitle = itemView.findViewById(R.id.tvTitle);
            tvAuthor = itemView.findViewById(R.id.tvAuthor);
            tvMeta = itemView.findViewById(R.id.tvMeta);
        }
    }
}
```

### `adapter/ReviewAdapter.java`

```java
package com.bookmanagermobile.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bookmanagermobile.R;
import com.bookmanagermobile.model.Review;

import java.util.ArrayList;
import java.util.List;

public class ReviewAdapter extends RecyclerView.Adapter<ReviewAdapter.ReviewViewHolder> {
    private final List<Review> reviews = new ArrayList<>();

    public void submitList(List<Review> newReviews) {
        reviews.clear();
        if (newReviews != null) reviews.addAll(newReviews);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ReviewViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_review, parent, false);
        return new ReviewViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ReviewViewHolder holder, int position) {
        Review review = reviews.get(position);
        holder.tvRating.setText("Rating: " + review.getRating());
        holder.tvComment.setText(review.getComment() != null ? review.getComment() : "");
        holder.tvMeta.setText(review.getCreatedAt() != null ? review.getCreatedAt() : "");
    }

    @Override
    public int getItemCount() {
        return reviews.size();
    }

    static class ReviewViewHolder extends RecyclerView.ViewHolder {
        TextView tvRating, tvComment, tvMeta;

        public ReviewViewHolder(@NonNull View itemView) {
            super(itemView);
            tvRating = itemView.findViewById(R.id.tvRating);
            tvComment = itemView.findViewById(R.id.tvComment);
            tvMeta = itemView.findViewById(R.id.tvMeta);
        }
    }
}
```

### `adapter/UserAdapter.java`

```java
package com.bookmanagermobile.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bookmanagermobile.R;
import com.bookmanagermobile.model.User;

import java.util.ArrayList;
import java.util.List;

public class UserAdapter extends RecyclerView.Adapter<UserAdapter.UserViewHolder> {
    public interface OnUserActionListener {
        void onToggleRole(User user);
        void onDelete(User user);
    }

    private final List<User> users = new ArrayList<>();
    private final OnUserActionListener listener;

    public UserAdapter(OnUserActionListener listener) {
        this.listener = listener;
    }

    public void submitList(List<User> newUsers) {
        users.clear();
        if (newUsers != null) users.addAll(newUsers);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public UserViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_user, parent, false);
        return new UserViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull UserViewHolder holder, int position) {
        User user = users.get(position);
        holder.tvName.setText(user.getName());
        holder.tvEmail.setText(user.getEmail());
        holder.tvRole.setText("Role: " + user.getRole());

        holder.itemView.setOnClickListener(v -> listener.onToggleRole(user));
        holder.itemView.setOnLongClickListener(v -> {
            listener.onDelete(user);
            return true;
        });
    }

    @Override
    public int getItemCount() {
        return users.size();
    }

    static class UserViewHolder extends RecyclerView.ViewHolder {
        TextView tvName, tvEmail, tvRole;

        public UserViewHolder(@NonNull View itemView) {
            super(itemView);
            tvName = itemView.findViewById(R.id.tvName);
            tvEmail = itemView.findViewById(R.id.tvEmail);
            tvRole = itemView.findViewById(R.id.tvRole);
        }
    }
}
```

## 11. Java code cho Activity

### `ui/SplashActivity.java`

```java
package com.bookmanagermobile.ui;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;

import androidx.appcompat.app.AppCompatActivity;

import com.bookmanagermobile.storage.SessionManager;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            SessionManager sessionManager = new SessionManager(this);
            String token = sessionManager.getToken();
            Intent intent = new Intent(this, token == null ? LoginActivity.class : BookListActivity.class);
            startActivity(intent);
            finish();
        }, 1500);
    }
}
```

### `ui/LoginActivity.java`

```java
package com.bookmanagermobile.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.bookmanagermobile.R;
import com.bookmanagermobile.model.AuthResponse;
import com.bookmanagermobile.model.LoginRequest;
import com.bookmanagermobile.network.ApiClient;
import com.bookmanagermobile.network.ApiService;
import com.bookmanagermobile.storage.SessionManager;
import com.google.android.material.textfield.TextInputEditText;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    private TextInputEditText etEmail, etPassword;
    private TextView tvStatus;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        sessionManager = new SessionManager(this);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        tvStatus = findViewById(R.id.tvStatus);
        Button btnLogin = findViewById(R.id.btnLogin);
        TextView tvGoRegister = findViewById(R.id.tvGoRegister);

        btnLogin.setOnClickListener(v -> login());
        tvGoRegister.setOnClickListener(v -> startActivity(new Intent(this, RegisterActivity.class)));
    }

    private void login() {
        String email = String.valueOf(etEmail.getText()).trim();
        String password = String.valueOf(etPassword.getText()).trim();

        ApiService apiService = ApiClient.getClient(null).create(ApiService.class);
        apiService.login(new LoginRequest(email, password)).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    sessionManager.saveToken(response.body().getToken());
                    startActivity(new Intent(LoginActivity.this, BookListActivity.class));
                    finish();
                } else {
                    tvStatus.setText("Dang nhap that bai");
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                tvStatus.setText(t.getMessage());
            }
        });
    }
}
```

### `ui/RegisterActivity.java`

```java
package com.bookmanagermobile.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.bookmanagermobile.R;

public class RegisterActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        Button btnRegister = findViewById(R.id.btnRegister);
        btnRegister.setOnClickListener(v -> {
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }
}
```

### `ui/BookListActivity.java`

```java
package com.bookmanagermobile.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bookmanagermobile.R;
import com.bookmanagermobile.adapter.BookAdapter;
import com.bookmanagermobile.model.Book;
import com.bookmanagermobile.network.ApiClient;
import com.bookmanagermobile.network.ApiService;
import com.bookmanagermobile.storage.SessionManager;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookListActivity extends AppCompatActivity implements BookAdapter.OnBookClickListener {
    private BookAdapter adapter;
    private SessionManager sessionManager;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_list);

        sessionManager = new SessionManager(this);
        apiService = ApiClient.getClient(sessionManager.getToken()).create(ApiService.class);

        EditText etSearch = findViewById(R.id.etSearch);
        Button btnRefresh = findViewById(R.id.btnRefresh);
        RecyclerView rvBooks = findViewById(R.id.rvBooks);

        adapter = new BookAdapter(this);
        rvBooks.setLayoutManager(new LinearLayoutManager(this));
        rvBooks.setAdapter(adapter);

        btnRefresh.setOnClickListener(v -> loadBooks(null, null));
        loadBooks(null, null);
    }

    private void loadBooks(String author, String genre) {
        apiService.getBooks(author, genre).enqueue(new Callback<List<Book>>() {
            @Override
            public void onResponse(Call<List<Book>> call, Response<List<Book>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    adapter.submitList(response.body());
                }
            }

            @Override
            public void onFailure(Call<List<Book>> call, Throwable t) {
            }
        });
    }

    @Override
    public void onBookClick(Book book) {
        Intent intent = new Intent(this, BookDetailActivity.class);
        intent.putExtra("book", book);
        startActivity(intent);
    }

    @Override
    public void onEditClick(Book book) { }

    @Override
    public void onDeleteClick(Book book) { }
}
```

### `ui/BookDetailActivity.java`

```java
package com.bookmanagermobile.ui;

import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bookmanagermobile.R;
import com.bookmanagermobile.adapter.ReviewAdapter;
import com.bookmanagermobile.model.Book;
import com.bookmanagermobile.model.BookDetailResponse;
import com.bookmanagermobile.network.ApiClient;
import com.bookmanagermobile.network.ApiService;
import com.bookmanagermobile.storage.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookDetailActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_detail);

        TextView tvTitle = findViewById(R.id.tvTitle);
        TextView tvAuthor = findViewById(R.id.tvAuthor);
        TextView tvRating = findViewById(R.id.tvRating);
        TextView tvDescription = findViewById(R.id.tvDescription);
        RecyclerView rvReviews = findViewById(R.id.rvReviews);
        Button btnAddReview = findViewById(R.id.btnAddReview);

        ReviewAdapter reviewAdapter = new ReviewAdapter();
        rvReviews.setLayoutManager(new LinearLayoutManager(this));
        rvReviews.setAdapter(reviewAdapter);

        Book book = (Book) getIntent().getSerializableExtra("book");
        if (book != null) {
            tvTitle.setText(book.getTitle());
            tvAuthor.setText(book.getAuthor());
            tvRating.setText("Rating: " + (book.getRatingAverage() != null ? book.getRatingAverage() : 0));
            tvDescription.setText(book.getDescription());
        }
    }
}
```

### `ui/BookFormActivity.java`

```java
package com.bookmanagermobile.ui;

import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.bookmanagermobile.R;

public class BookFormActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_form);

        Button btnSaveBook = findViewById(R.id.btnSaveBook);
        btnSaveBook.setOnClickListener(v -> {
            // Neu co bookId thi update, neu khong thi create
        });
    }
}
```

### `ui/ReviewListActivity.java`

```java
package com.bookmanagermobile.ui;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.bookmanagermobile.R;

public class ReviewListActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review_list);
    }
}
```

### `ui/ProfileActivity.java`

```java
package com.bookmanagermobile.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

import com.bookmanagermobile.R;
import com.bookmanagermobile.storage.SessionManager;

public class ProfileActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        SessionManager sessionManager = new SessionManager(this);
        Button btnLogout = findViewById(R.id.btnLogout);
        btnLogout.setOnClickListener(v -> {
            sessionManager.clear();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }
}
```

### `ui/AdminUsersActivity.java`

```java
package com.bookmanagermobile.ui;

import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.bookmanagermobile.R;

public class AdminUsersActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_admin_users);
    }
}
```

## 12. Cach noi luong hoat dong

1. `SplashActivity` kiem tra token.
2. Neu co token thi vao `BookListActivity`.
3. Neu chua co token thi vao `LoginActivity`.
4. Login thanh cong se luu token trong `SessionManager`.
5. `BookListActivity` goi API `GET /api/books`.
6. Click sach se vao `BookDetailActivity`.
7. Admin co them `BookFormActivity` va `AdminUsersActivity`.

## 13. Goi y hoan thien tiep

Neu ban muon lam app dep hon, nen lam tiep:

- Them ViewModel + LiveData
- Hoan chinh adapter co nut edit/delete
- Hoan chinh dialog them review
- Them bottom navigation cho user
- Them drawer cho admin
- Them search va filter sach theo author / genre

## 14. Summary nhanh

Day la bo khung day du de ban bat dau Android Studio Java cho du an `bookmanagermobile`.

Neu ban muon, buoc tiep theo minh co the viet tiep cho ban:

- Ban full code cho tung file Java de copy vao Android Studio
- Ban full XML cho tung screen dep hon nua
- Ban ban APK flow va cach test tren emulator