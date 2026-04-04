<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    if (isset($data["name"]) && isset($data["email"]) && isset($data["message"])) {
        $name = strip_tags($data["name"]);
        $email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);
        $message = strip_tags($data["message"]);

        $recipient = "jowieja22@gmail.com"; 
        $subject = "Neue Kontaktanfrage von $name";
        
        $headers = "From: contact@jan-oliver-kaemmerer.de\r\n"; // Replace with your domain mail if needed
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        $mailBody = "Name: $name\n";
        $mailBody .= "Email: $email\n\n";
        $mailBody .= "Nachricht:\n$message";

        if (mail($recipient, $subject, $mailBody, $headers)) {
            echo json_encode(["message" => "Email sent successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Email could not be sent"]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "Inklomplette Daten"]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
