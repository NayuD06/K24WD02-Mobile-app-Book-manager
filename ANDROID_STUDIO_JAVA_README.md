# Book Manager Mobile App - Android Studio Java

Tai lieu nay danh cho phan mobile app Android viet bang Java, ket noi truc tiep toi backend hien co cua project Book Manager nay.

## 1. Tong quan

Backend hien co dang cung cap cac API sau:

- `POST /api/users/login` - dang nhap
- `POST /api/users` - dang ky
- `GET /api/users/profile` - lay thong tin ca nhan
- `GET /api/books` - danh sach sach
- `GET /api/books/:id` - chi tiet sach + reviews + rating trung binh
- `POST /api/books` - them sach moi
- `PUT /api/books/:id` - cap nhat sach
- `DELETE /api/books/:id` - xoa sach
- `GET /api/books/suggestions` - sach goi y
- `GET /api/books/:bookId/reviews` - reviews cua 1 sach
- `GET /api/reviews` - reviews cua nguoi dung hien tai hoac admin
- `POST /api/reviews` - tao review
- `PUT /api/reviews/:id` - cap nhat review
- `DELETE /api/reviews/:id` - xoa review

## 2. Kien truc de xay mobile app

De lam goc Android Studio Java gon va de bao tri, nen chia app thanh cac lop sau:

- `ui/` - Activity, Fragment, Adapter, ViewHolder
- `data/` - DTO, response model, repository
- `network/` - Retrofit, ApiService, interceptor
- `storage/` - SharedPreferences luu token va user
- `model/` - Book, Review, User, AuthResponse

Khuyen nghi dung:

- Material 3
- RecyclerView cho danh sach sach va reviews
- Bottom Navigation cho man hinh user
- Drawer hoac menu Icon cho man hinh admin
- Co card layout, padding rong, border radius lon, mau chu de ro rang

## 3. URL backend tren Android

Neu backend chay local tren may tinh:

- Android emulator: `http://10.0.2.2:9999/api`
- Dien thoai that: dung IP LAN cua may chay backend, vi du `http://192.168.1.10:9999/api`

## 4. Cai dat project Android Studio

### build.gradle (Module app)

```gradle
dependencies {
    implementation 'com.google.android.material:material:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.7.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.2.0'
    implementation 'androidx.recyclerview:recyclerview:1.4.0'

    implementation 'com.squareup.retrofit2:retrofit:2.11.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.11.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'

    implementation 'com.github.bumptech.glide:glide:4.16.0'
    annotationProcessor 'com.github.bumptech.glide:compiler:4.16.0'

    implementation 'androidx.lifecycle:lifecycle-viewmodel:2.8.7'
    implementation 'androidx.lifecycle:lifecycle-livedata:2.8.7'
}
```

### AndroidManifest.xml

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:usesCleartextTraffic="true"
        android:theme="@style/Theme.BookManager">

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

## 5. Theme va bo cuc giao dien

De giao dien trong sang va chuan cho app sach, nen dung bo mau sau:

- Primary: navy dam `#102A43`
- Secondary: amber `#D97706`
- Background: cream `#FAF7F2`
- Surface: white `#FFFFFF`
- Text main: `#102A43`
- Text muted: `#64748B`

Style goi y:

- Card cao, shadow nhe, radius 20dp
- Nut bo tron 14dp - 18dp
- Chu tieu de dam, khoang cach ro rang
- Dung anh bia sach neu co, neu khong thi hien icon sach + mau gradient

## 6. Danh sach man hinh can co

1. Splash Screen
2. Login Screen
3. Register Screen
4. Home / Book List Screen
5. Book Detail Screen
6. Add / Edit Book Screen
7. Reviews Screen
8. Profile Screen
9. Admin Dashboard / User Management Screen
10. Suggested Books Screen

## 7. Mapping man hinh voi API

| Man hinh | API chinh |
| --- | --- |
| Login | `POST /api/users/login` |
| Register | `POST /api/users` |
| Home / Book List | `GET /api/books` |
| Book Detail | `GET /api/books/:id` |
| Add Book | `POST /api/books` |
| Edit Book | `PUT /api/books/:id` |
| Delete Book | `DELETE /api/books/:id` |
| Reviews | `GET /api/reviews`, `POST /api/reviews`, `PUT /api/reviews/:id`, `DELETE /api/reviews/:id` |
| Profile | `GET /api/users/profile` |
| Admin Users | `GET /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id` |

## 8. Shared API layer

### ApiClient.java

```java
package com.bookmanager.network;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ApiClient {
    private static final String BASE_URL = "http://10.0.2.2:9999/api/";
    private static Retrofit retrofit;

    public static Retrofit getClient(String token) {
        if (retrofit == null) {
            HttpLoggingInterceptor logging = new HttpLoggingInterceptor();
            logging.setLevel(HttpLoggingInterceptor.Level.BODY);

            OkHttpClient.Builder clientBuilder = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .addInterceptor(logging);

            if (token != null && !token.isEmpty()) {
                clientBuilder.addInterceptor(chain -> {
                    okhttp3.Request request = chain.request().newBuilder()
                            .addHeader("Authorization", "Bearer " + token)
                            .build();
                    return chain.proceed(request);
                });
            }

            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .client(clientBuilder.build())
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}
```

### ApiService.java

```java
package com.bookmanager.network;

import java.util.List;

import com.bookmanager.model.Book;
import com.bookmanager.model.Review;
import com.bookmanager.model.User;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface ApiService {
    @POST("users/login")
    Call<AuthResponse> login(@Body LoginRequest body);

    @POST("users")
    Call<AuthResponse> register(@Body RegisterRequest body);

    @GET("users/profile")
    Call<User> getProfile();

    @GET("books")
    Call<List<Book>> getBooks();

    @GET("books/{id}")
    Call<BookDetailResponse> getBookDetail(@Path("id") String id);

    @POST("books")
    Call<Book> createBook(@Body Book body);

    @PUT("books/{id}")
    Call<Book> updateBook(@Path("id") String id, @Body Book body);

    @DELETE("books/{id}")
    Call<Void> deleteBook(@Path("id") String id);

    @GET("books/suggestions")
    Call<List<Book>> getSuggestions();

    @GET("reviews")
    Call<List<Review>> getReviews();

    @POST("reviews")
    Call<Review> createReview(@Body Review body);
}
```

### SessionManager.java

```java
package com.bookmanager.storage;

import android.content.Context;
import android.content.SharedPreferences;

public class SessionManager {
    private static final String PREF_NAME = "book_manager_session";
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

## 9. Giao dien tung man hinh

### 9.1 Splash Screen

Muc tieu:

- Hien logo Book Manager
- Kiem tra token trong SharedPreferences
- Chuyen den `BookListActivity` hoac `LoginActivity`

### activity_splash.xml

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

        <ImageView
            android:layout_width="92dp"
            android:layout_height="92dp"
            android:src="@drawable/ic_book_stack"
            android:contentDescription="Book Manager logo" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Book Manager"
            android:textStyle="bold"
            android:textSize="28sp"
            android:textColor="@android:color/white"
            android:layout_marginTop="12dp" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Manage books, reviews and users"
            android:textColor="#E2E8F0"
            android:layout_marginTop="6dp" />
    </LinearLayout>
</androidx.constraintlayout.widget.ConstraintLayout>
```

### 9.2 Login Screen

Muc tieu:

- Dang nhap bang email va password
- Nut chuyen sang dang ky
- Luu token sau khi dang nhap thanh cong

### activity_login.xml

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
            android:text="Chao mung quay lai"
            android:textSize="28sp"
            android:textStyle="bold"
            android:textColor="@color/text_primary" />

        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Dang nhap de quan ly sach va danh gia"
            android:textColor="@color/text_secondary"
            android:layout_marginTop="8dp" />

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
            android:text="Dang nhap"
            android:layout_marginTop="24dp" />

        <TextView
            android:id="@+id/tvGoRegister"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Chua co tai khoan? Dang ky ngay"
            android:textColor="@color/secondary"
            android:layout_marginTop="18dp" />
    </LinearLayout>
</ScrollView>
```

### 9.3 Register Screen

Muc tieu:

- Tao tai khoan moi
- Lay thong tin ten, email, password

### activity_register.xml

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
            android:text="Tao tai khoan moi"
            android:textSize="28sp"
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
                android:hint="Ho va ten" />
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
            android:text="Dang ky"
            android:layout_marginTop="24dp" />
    </LinearLayout>
</ScrollView>
```

### 9.4 Home / Book List Screen

Muc tieu:

- Hien danh sach sach
- Co search theo ten tac gia hoac the loai
- Nut refresh
- Admin se thay them edit/delete

### activity_book_list.xml

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
            android:title="Book Manager"
            android:background="@color/surface"
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
                android:hint="Tim sach hoac tac gia" />
        </com.google.android.material.textfield.TextInputLayout>

        <androidx.recyclerview.widget.RecyclerView
            android:id="@+id/rvBooks"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            android:layout_weight="1"
            android:layout_marginTop="12dp"
            android:clipToPadding="false"
            android:paddingBottom="16dp" />

        <com.google.android.material.button.MaterialButton
            android:id="@+id/btnRefresh"
            android:layout_width="match_parent"
            android:layout_height="52dp"
            android:text="Tai lai danh sach" />
    </LinearLayout>

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

### item_book.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginBottom="14dp"
    app:cardCornerRadius="20dp"
    app:cardElevation="3dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        android:padding="16dp">

        <TextView
            android:id="@+id/tvTitle"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:text="Title"
            android:textStyle="bold"
            android:textSize="18sp"
            android:textColor="@color/text_primary" />

        <TextView
            android:id="@+id/tvAuthor"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="4dp"
            android:text="Author"
            android:textColor="@color/text_secondary" />

        <TextView
            android:id="@+id/tvMeta"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="10dp"
            android:text="Genre • Rating"
            android:textColor="@color/secondary" />
    </LinearLayout>
</com.google.android.material.card.MaterialCardView>
```

### 9.5 Book Detail Screen

Muc tieu:

- Hien title, author, genre, mo ta, ngay phat hanh
- Hien rating trung binh va so review
- Co danh sach review ben duoi
- Co nut them review

### activity_book_detail.xml

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
            android:text="Book title"
            android:textSize="24sp"
            android:textStyle="bold"
            android:textColor="@color/text_primary" />

        <TextView
            android:id="@+id/tvAuthor"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:text="by Author"
            android:textColor="@color/text_secondary" />

        <com.google.android.material.card.MaterialCardView
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_marginTop="20dp"
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
                    android:text="4.5 / 5"
                    android:textStyle="bold"
                    android:textSize="20sp" />

                <TextView
                    android:id="@+id/tvDescription"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:layout_marginTop="10dp"
                    android:text="Description" />
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

### 9.6 Add / Edit Book Screen

Muc tieu:

- Admin them moi sach
- Admin sua sach
- Field can co: title, author, genre, publishedDate, description

### activity_book_form.xml

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
                android:hint="Published date"
                android:inputType="date" />
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

### 9.7 Reviews Screen

Muc tieu:

- Hien review cua user dang dang nhap
- Admin co the xem tat ca
- Co nut sua/xoa review

### activity_review_list.xml

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

### 9.8 Profile Screen

Muc tieu:

- Hien ten, email, role
- Nut logout
- Neu la admin, co nut di den admin dashboard

### activity_profile.xml

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
                android:text="Name"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/tvEmail"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp"
                android:text="Email" />

            <TextView
                android:id="@+id/tvRole"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="8dp"
                android:text="Role" />
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

### 9.9 Admin Dashboard / User Management

Muc tieu:

- Hien danh sach user
- Doi role user <-> admin
- Xoa user neu can

### activity_admin_users.xml

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
        android:textStyle="bold"
        android:textSize="26sp"
        android:textColor="@color/text_primary" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/rvUsers"
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:layout_marginTop="12dp" />
</LinearLayout>
```

## 10. Java code skeleton cho cac man hinh chinh

### LoginActivity.java

```java
package com.bookmanager.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {
    private EditText etEmail, etPassword;
    private TextView tvStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        Button btnLogin = findViewById(R.id.btnLogin);
        TextView tvGoRegister = findViewById(R.id.tvGoRegister);

        btnLogin.setOnClickListener(v -> {
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();
            // Goi API login, luu token, sau do chuyen man hinh
        });

        tvGoRegister.setOnClickListener(v ->
                startActivity(new Intent(this, RegisterActivity.class)));
    }
}
```

### BookListActivity.java

```java
package com.bookmanager.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

public class BookListActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_list);

        EditText etSearch = findViewById(R.id.etSearch);
        Button btnRefresh = findViewById(R.id.btnRefresh);
        RecyclerView rvBooks = findViewById(R.id.rvBooks);

        rvBooks.setLayoutManager(new LinearLayoutManager(this));
        // gan adapter va load danh sach sach tu API
    }
}
```

### BookDetailActivity.java

```java
package com.bookmanager.ui;

import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

public class BookDetailActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_detail);

        RecyclerView rvReviews = findViewById(R.id.rvReviews);
        Button btnAddReview = findViewById(R.id.btnAddReview);

        rvReviews.setLayoutManager(new LinearLayoutManager(this));
        // Lay book detail va reviews theo id truyen qua Intent
    }
}
```

### BookFormActivity.java

```java
package com.bookmanager.ui;

import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class BookFormActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_form);

        Button btnSaveBook = findViewById(R.id.btnSaveBook);
        // Neu co bookId thi chuyen sang mode edit, neu khong thi mode add
    }
}
```

### ProfileActivity.java

```java
package com.bookmanager.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class ProfileActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        Button btnLogout = findViewById(R.id.btnLogout);
        btnLogout.setOnClickListener(v -> {
            // xoa token + user, quay ve LoginActivity
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        });
    }
}
```

## 11. Luong chay ung dung

1. SplashActivity kiem tra token
2. Neu da dang nhap thi vao BookListActivity hoac AdminUsersActivity neu role la admin
3. Neu chua dang nhap thi vao LoginActivity
4. Tu Home co the mo BookDetailActivity
5. Tu BookDetail co the them review
6. Admin co them/sua/xoa sach va quan ly user

## 12. Danh sach mau code can bo sung tiep

Neu ban muon hoan thien app nhanh, nhung file sau nen lam tiep:

- `model/Book.java`
- `model/Review.java`
- `model/User.java`
- `model/AuthResponse.java`
- `model/BookDetailResponse.java`
- `adapter/BookAdapter.java`
- `adapter/ReviewAdapter.java`
- `adapter/UserAdapter.java`
- `network/ApiService.java`
- `network/ApiClient.java`
- `storage/SessionManager.java`

## 13. Ghi chu quan trong

- Backend dang bat buoc JWT cho nhieu API, nen Android app phai luu token sau login.
- Neu test tren dien thoai that, khong dung `localhost`, phai dung IP may tinh chay backend.
- API dang tra ve JSON thuong, nen dung Gson cho Retrofit.
- Neu muon an toan hon, co the chuyen sang ViewModel + Repository + LiveData de code sach va de test.

## 14. De xuat doan mo ta giao dien chuan Book Manager

Neu ban muon giao dien dep va de dung, co the theo style nay:

- Man hinh Home: hero header nho, search bar, danh sach card sach
- Man hinh Detail: anh bia hoac placeholder lon, thong tin sach o tren, review o duoi
- Man hinh Form: form tron gon, nut Save co mau noi bat
- Man hinh Admin: sidebar hoac tab rieng, danh sach user va sach tach ro
- Man hinh Profile: card thong tin ca nhan + nut logout ro rang

## 15. Mau mau cho colors.xml

```xml
<resources>
    <color name="app_background">#FAF7F2</color>
    <color name="surface">#FFFFFF</color>
    <color name="text_primary">#102A43</color>
    <color name="text_secondary">#64748B</color>
    <color name="secondary">#D97706</color>
    <color name="primary">#102A43</color>
</resources>
```

## 16. Ket luan

Ban co the dung tai lieu nay nhu bo khung de tao app Android Studio Java cho Book Manager. Neu muon, buoc tiep theo hop ly nhat la viet tiep cac file Java hoan chinh cho tung man hinh va adapter RecyclerView.