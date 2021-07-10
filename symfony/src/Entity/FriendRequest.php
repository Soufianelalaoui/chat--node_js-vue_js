<?php

namespace App\Entity;

use App\Repository\FriendRequestRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=FriendRequestRepository::class)
 */
class FriendRequest
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="sentFriendRequests")
     * @ORM\JoinColumn(nullable=false)
     */
    private $requesterUser;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="friendRequestsGot")
     * @ORM\JoinColumn(nullable=false)
     */
    private $requestedUser;

    /**
     * @ORM\Column(type="boolean")
     */
    private $pending;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRequesterUser(): ?User
    {
        return $this->requesterUser;
    }

    public function setRequesterUser(?User $requesterUser): self
    {
        $this->requesterUser = $requesterUser;

        return $this;
    }

    public function getRequestedUser(): ?User
    {
        return $this->requestedUser;
    }

    public function setRequestedUser(?User $requestedUser): self
    {
        $this->requestedUser = $requestedUser;

        return $this;
    }

    public function getPending(): ?bool
    {
        return $this->pending;
    }

    public function setPending(bool $pending): self
    {
        $this->pending = $pending;

        return $this;
    }


}
