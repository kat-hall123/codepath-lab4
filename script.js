function loadReviews() {
    fetch('reviews.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Successfully loaded reviews:", data);
      // You can now use `data` to display the reviews on the page
        
        const reviewsList = document.getElementById("reviews-list");
        reviewsList.innerHTML = ""; // Optional: clear old reviews before adding new ones

        data.forEach(review => {
            const reviewElement = createReviewElement(review); // Create DOM element
            reviewsList.appendChild(reviewElement); // Add to the page
        });
    })
    .catch(error => {
        console.error("Error loading reviews:", error);
    });
}

function handleReviewSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const title = form.elements["book-title"].value;
    const reviewText = form.elements["review-text"].value;
    const rating = form.elements["rating"].value;

    const newReview = {
        id: Date.now().toString(),
        title: title,
        reviewText: reviewText,
        rating: parseInt(rating),
        likes: 0,       // New reviews start with 0 likes
        reposts: 0      // ...and 0 reposts
    };

    const reviewElement = createReviewElement(newReview);

    const reviewsList = document.getElementById("reviews-list");
    reviewsList.insertBefore(reviewElement, reviewsList.firstChild);

    form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
    loadReviews();

    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener("submit", handleReviewSubmit);
});

function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';

    const titleElem = document.createElement('h3');
    titleElem.textContent = review.title;

    const reviewElem = document.createElement('p');
    reviewElem.textContent = review.reviewText;

    const ratingElem = document.createElement('p');
    ratingElem.textContent = `Rating: ${review.rating}`;

    const likeButton = document.createElement('button');
    likeButton.textContent = `Like (${review.likes})`;
    likeButton.id = `like-${review.id}`;
    likeButton.dataset.liked = "false";
    likeButton.addEventListener('click', () => toggleLike(review.id));

    const repostButton = document.createElement("button");
    repostButton.textContent = `Reposts (${review.reposts})`;;
    repostButton.id = `repost-${review.id}`;
    repostButton.addEventListener("click", () => repostReview(review.id));

    reviewDiv.appendChild(titleElem);
    reviewDiv.appendChild(reviewElem);
    reviewDiv.appendChild(ratingElem);
    reviewDiv.appendChild(likeButton);
    reviewDiv.appendChild(repostButton);

    return reviewDiv;
}

function toggleLike(reviewId) {
    const likeButton = document.getElementById(`like-${reviewId}`);
    const liked = likeButton.dataset.liked === "true";

    // Extract number from button text like: "Like (3)"
    let currentLikes = parseInt(likeButton.textContent.match(/\d+/)[0]);

    if (!liked) {
        currentLikes++;
        likeButton.textContent = `Unlike (${currentLikes})`;
        likeButton.dataset.liked = "true";
    } else {
        currentLikes--;
        likeButton.textContent = `Like (${currentLikes})`;
        likeButton.dataset.liked = "false";
    }
}

function repostReview(reviewId) {
    const repostButton = document.getElementById(`repost-${reviewId}`);
    
    // Extract number from button text like: "Reposts (2)"
    let currentReposts = parseInt(repostButton.textContent.match(/\d+/)[0]);

    currentReposts++;
    repostButton.textContent = `Reposts (${currentReposts})`;
}