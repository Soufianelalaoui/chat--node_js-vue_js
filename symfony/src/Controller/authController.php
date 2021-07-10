<?php
namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use \Firebase\JWT\JWT;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validation;

class authController extends AbstractController
{
    /**
     * @Route(name="login", path="/api/login", methods={"POST"})
     * @return JsonResponse
     */
    public function login(): JsonResponse
    {

        $user = $this->getUser();

        return new JsonResponse([
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
        ]);
    }
}

