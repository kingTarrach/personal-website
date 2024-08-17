console.log('Sidebar script loaded');

document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');

    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('hidden');
        toggleButton.classList.toggle('rotate');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const likeButton = document.getElementById('likeButton');
    const heartIcon = document.getElementById('heartIcon');
    const likeCount = document.getElementById('likeCount');

    function updateLikeCount(likes) {
        likeCount.textContent = likes;
    }

    // Fetch the current number of likes when the page loads
    fetch('/likes')
        .then(response => response.json())
        .then(data => {
            updateLikeCount(data.likes);
        })
        .catch(error => console.error('Error:', error));

    likeButton.addEventListener('click', function () {
        const isLiked = heartIcon.src.includes('Full_Heart.jpg');

        // Toggle heart icon
        if (isLiked) {
            heartIcon.src = '/Icons/Empty_Heart.jpg';
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
        } else {
            heartIcon.src = '/Icons/Full_Heart.jpg';
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        }

        // Send like/unlike request to the server
        fetch('/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ like: !isLiked })
        })
        .then(response => response.json())
        .then(data => {
            likeCount.textContent = data.likes;
        })
        .catch(error => console.error('Error:', error));
    });
});


    // Delegate events from the comments section
    $('#commentsList').on('click', '.like-comment-button', function() {
        const commentId = $(this).data('comment-id');
        likeComment(commentId);
    });

    $('#commentsList').on('click', '.reply-button', function() {
        const commentId = $(this).data('comment-id');
        toggleReplyForm(commentId);
    });

    $('.comments-section').on('click', '.post-reply-button', function() {
        const commentId = $(this).data('comment-id');
        postReply(commentId);
    });


    // Toggle reply form visibility
    window.toggleReplyForm = function(commentId) {
        $(`#reply-form-${commentId}`).toggle();
    };

    // Refresh comments on the page
    function refreshComments(comments) {
        const commentsList = $('#commentsList');
        commentsList.empty();
        comments.forEach(comment => {
            const date = new Date(comment.timestamp);
            const formattedDate = date.toLocaleString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });
            commentsList.append(`
                <div class="comment">
                    <span class="commenter-name">${comment.name}:</span> 
                    <span>${comment.comment}</span> 
                    <small>Posted on ${formattedDate}</small>
                </div>
            `);
        });
    }


  
function postReply(commentId) {
    const replyText = $(`#reply-form-${commentId} textarea`).val();
    // Assuming AJAX call or another method to submit the reply
    console.log('Posting reply:', replyText, 'for comment ID:', commentId);
    // Implement the AJAX call or form submission logic here
}

  
